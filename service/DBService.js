'use strict';

const models = require('../models');
const crypto = require('crypto');

const Project = models.Project;
const User = models.User;
const Voucher = models.Voucher;
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
    createUserWithProject: async function (userProject) {
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
    createUserWithVoucher: async function (user, voucherId) {
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
    updateUser: async function (user, userId) {
        return await User.update(user, {
            where: {
                id: userId
            }
        });
    },
    /**
     * Delete a user
     * @param {Number} userId 
     */
    deleteUser: async function (userId) {
        return await User.destroy({ where: { id: userId } });
    },
    /**
     * create a project and assign to existing user
     * @param {Object} project
     * @returns {Project}
     */
    createProject: async function (project) {
        return await Project.create(
            project
        );
    },
    /**
     * Update a project
     * @param {Project} project 
     * @param {Number} projectId 
     */
    updateProject: async function (project, projectId) {
        return await Project.update(project, {
            where: {
                id: projectId
            }
        });
    },
    /**
     * Delete a project
     * @param {Number} projectId 
     */
    deleteProject: async function (projectId) {
        return await Project.destroy({ where: { id: projectId } });
    },
    /**
     * Create a voucher for a project
     * @param {Number} projectId 
     * @returns {Voucher}
     */
    createVoucher: async function (projectId) {
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
    deleteParticipantProject: async function (projectId, participantId) {
        return await Voucher.destroy({ where: { projectId: projectId, participantId: participantId } });
    },
    /**
     * Add participant to a project
     * @param {Number} userId 
     * @param {Number} voucherId 
     * @returns {Number}
     */
    addParticipantProject: async function (userId, voucherId) {
        var transaction = await sequelize.transaction();
        var voucher = await Voucher.findOne({ where: { id: voucherId, participantId: null }, transaction: transaction, lock: true });

        if (voucher === null) {
            throw new Error('Token not found of incorrect');
        }

        await voucher.setParticipant(userId, { transaction: transaction });

        return await voucher.getParticipant();
    }
};