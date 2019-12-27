'use strict';

const models = require('../models');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const logger = require('pino')()

const Project = models.Project;
const User = models.User;
const Voucher = models.Voucher;
const Registration = models.Registration;
const sequelize = models.sequelize;
const Op = Sequelize.Op;

const MAX_VOUCHERS = 2

module.exports = {
    /**
    * Create a new user with a project
    * @param {Object} userProjext - UserProject object
    * @returns {User}
    * @example     
        {
            postalcode: 1000,
            email: "test@test.be",
            gsm: "003237722452",
            firstname: 'John',
            lastname: 'Doe',
            sex: 'm',
            birthmonth: new Date(2003, 01, 01),
            mandatory_approvals: 'aa',
            t_size: 'female_large',
            project: {
                project_name: 'test',
                project_descr: 'aaa',
                project_type: 'aa'
            }
        }
    */
   async createUserWithProject(userProject, registrationId) {
        var transaction = await sequelize.transaction();
        var user = await User.create(userProject, { include: ['project'], transaction: transaction});
        await Registration.destroy({ where: { id: registrationId }, transaction: transaction });
        await transaction.commit();
        return user;
    },
    /**
     * Create a new user with a token
     * @param {Object} user - User object 
     * @param {Number} voucherId - voucher id
     * @returns {User}
     * @example
        {
            postalcode: 1000,
            email: "test@test.be",
            gsm: "003237722452",
            firstname: 'John',
            lastname: 'Doe',
            sex: 'm',                
            birthmonth: new Date(2003, 01, 01),
            mandatory_approvals: 'aa',
            t_size: 'female_large'
        }
     */
    async createUserWithVoucher(user, voucherId, registrationId) {
        var transaction = await sequelize.transaction();
        var voucher = await Voucher.findOne({ where: { id: voucherId, participantId: null }, transaction: transaction, lock: true });

        if (voucher === null) {
            throw new Error('Token not found of incorrect');
        }

        var user = await User.create(user, { transaction: transaction });
        await voucher.setParticipant(user, { transaction: transaction });
        await Registration.destroy({ where: { id: registrationId }, transaction: transaction });
        await transaction.commit();

        return user;
    },
    /**
     * Update user information
     * @param {User} user
     * @param {Number} userId
     */
    async updateUser(changedFields, userId) {
        var user = await User.findByPk(userId);
        console.log(changedFields);
        var result = await user.update(changedFields);
        if(result === false){
            throw new Error('Update failed');
        }
        return result;
    },
    /**
     * Get registration information
     * @param {Number} registrationId
     * @returns {Registration}
     */
    async getRegistration(registrationId) {
        var registration = await Registration.findByPk(registrationId);
        return registration
    },    
    /**
     * Delete a user
     * @param {Number} userId 
     */
    async deleteUser(userId) {
        return await User.destroy({ where: { id: userId } });
    },
    /**
     * create a project and assign to existing user
     * @param {Object} project
     * @returns {Project}
     */
    async createProject(project, userId) {
        project.ownerId = userId;
        return await Project.create(project);
    },
    /**
     * Update a project
     * @param {Project} project 
     * @param {Number} userId 
     */
    async updateProject(changedFields, userId) {
        var project = await Project.findOne({ where: { ownerId: userId }});
        if(result === false){
            throw new Error('Update failed');
        }
        return result;
    },
    /**
     * Delete a project
     * @param {Number} userId 
     */
    async deleteProject(userId) {
        await Voucher.destroy({ where: { participantId: userId } });
        return await Project.destroy({ where: { ownerId: userId } });
    },
    /**
     * Create a voucher for a project
     * @param {Number} projectId 
     * @returns {Voucher}
     */
    async createVoucher(userId) {
        var project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id']});
        logger.info("Project found: " + project.id);

        var totalVouchers = await Voucher.count({ where: { projectId: project.id } });
        if (totalVouchers >= MAX_VOUCHERS) {
            throw new Error('Max token reached');
        }

        var token = await new Promise(function (resolve, reject) {
            crypto.randomBytes(18, function (error, buffer) {
                if (error) {
                    reject(error);
                }
                resolve(buffer.toString('hex'));
            });
        });
        return await Voucher.create({ projectId: project.id, id: token });
    },    
    /**
     * Delete a participant from a project
     * @param {Number} projectId 
     * @param {Number} participantId 
     */
    async deleteParticipantProject(projectId, participantId) {
        return await Voucher.destroy({ where: { projectId: projectId, participantId: participantId } });
    },
    /**
     * Add participant to a project
     * @param {Number} userId 
     * @param {Number} voucherId 
     * @returns {Number}
     */
    async addParticipantProject(userId, voucherId) {
        var transaction = await sequelize.transaction();
        var voucher = await Voucher.findOne({ where: { id: voucherId, participantId: null }, transaction: transaction, lock: true });

        if (voucher === null) {
            throw new Error('Token not found of incorrect');
        }

        await voucher.setParticipant(userId, { transaction: transaction });

        return await voucher.getParticipant();
    },
    /**
     * Add registration
     * @param {Registration} registration
     * @returns {Registration}
     */
    async createRegistration(registration) {
        return await Registration.create(registration);
    },
    /**
     * Add registration
     * @param {Registration} registration
     * @returns {Registration}
     */
    async getUser(userId) {
        return await User.findByPk(userId);
    },
    /**
     * Add registration
     * @param {Registration} registration
     * @returns {Registration}
     */
    async getVouchers(userId) {
        var project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id']});
        let vouchers = [];
        if (project !== null) {
            logger.info("Project found: " + project.id);
            vouchers = await Voucher.findAll({ where: { projectId: project.id }, attributes: ['id'], include: [{
                model: User,
                as: 'participant',
                attributes: ['firstname', 'lastname']
            }]});
        }
        return vouchers;
    },
    /**
     * get Project
     * @param {Registration} registration
     * @returns {Registration}
     */
    async getProject(userId) {
        // own project
        let project = await Project.findOne({ where: { ownerId: userId }});

        if (project === null) {
            const voucher = await Voucher.findOne({ where: { participantId: userId }, attributes: ['projectId']});
            logger.info("Project found: " + voucher.projectId);
            project = await Project.findByPk(voucher.projectId);
        }
        return project;
    },   
    /**
     * Check if email adress exists in User records table
     * @param {String} email
     * @returns {boolean}
     */
    async doesEmailExists(emailAddres) {
        const count = await User.count({ where: { email: emailAddres } });
        return count !== 0;
    },
    /**
     * Get user via email
     * @param {String} email
     * @returns {Array.<User>}
     */
    async getUsersViaMail(email) {
        return User.findAll({
            where: {
                [Op.or]: [
                    {
                        email: email
                    },
                    {
                        email_guardian: email
                    }
                ]    
            }
        });
    },
    /**
     * Update token
     * @param {User} user
     */
    async updateLastToken(user){
        user.last_token = new Date();
        await user.save();
    }
};