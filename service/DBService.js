'use strict';

const models = require('../models');
const crypto = require('crypto');

const Project = models.Project;
const User = models.User;
const Voucher = models.Voucher;
const Registration = models.Registration;
const sequelize = models.sequelize;

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
   async createUserWithProject(userProject) {
        return await User.create(userProject, { include: ['project'] });
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
    async createUserWithVoucher(user, voucherId) {
        var transaction = await sequelize.transaction();
        var voucher = await Voucher.findOne({ where: { id: voucherId, participantId: null }, transaction: transaction, lock: true });

        if (voucher === null) {
            throw new Error('Token not found of incorrect');
        }

        var user = await User.create(user, { transaction: transaction });
        await voucher.setParticipant(user, { transaction: transaction });

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
        var result = await user.update(changedFields);
        if(result === false){
            throw new Error('Update failed');
        }
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
    async createProject(project) {
        return await Project.create(project);
    },
    /**
     * Update a project
     * @param {Project} project 
     * @param {Number} projectId 
     */
    async updateProject(changedFields, projectId) {
        var project = await Project.findByPk(projectId);
        var result = await project.update(changedFields);
        if(result === false){
            throw new Error('Update failed');
        }
    },
    /**
     * Delete a project
     * @param {Number} projectId 
     */
    async deleteProject(projectId) {
        return await Project.destroy({ where: { id: projectId } });
    },
    /**
     * Create a voucher for a project
     * @param {Number} projectId 
     * @returns {Voucher}
     */
    async createVoucher(projectId) {
        var totalVouchers = await Voucher.count({ where: { projectId: projectId } });

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
        return await Voucher.create({ projectId: projectId, id: token });
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
    }
};