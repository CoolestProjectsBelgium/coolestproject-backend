'use strict';

const cls = require('cls-hooked');
const namespace = cls.createNamespace('coolestproject');

const models = require('../models');
const crypto = require('crypto');

const Sequelize = require('sequelize');
Sequelize.useCLS(namespace);

const logger = require('pino')()
const bcrypt = require("bcrypt");

const Account = models.Account;
const Project = models.Project;
const User = models.User;
const Voucher = models.Voucher;
const Registration = models.Registration;
const sequelize = models.sequelize;
const Op = Sequelize.Op;

const MAX_VOUCHERS = process.env.MAX_VOUCHERS || 0

class DBA {
    /**
     * @param {Integer} registrationId 
     * @returns {Promise<User>} created User
     */
    async createUserFromRegistration(registrationId) {
        await sequelize.transaction(
            async (t) => {
                const registration = await this.getRegistration(registrationId);
                if (registration === null) {
                    throw new Error(`No registration found for id ${registrationId}`)
                }
                let userId = null
                if (registration.project_code) {
                    // create user and add to existing project
                    const participant = await this.createUserWithVoucher(
                        {
                            language: registration.language,
                            postalcode: registration.postalcode,
                            email: registration.email,
                            gsm: registration.gsm,
                            firstname: registration.firstname,
                            lastname: registration.lastname,
                            sex: registration.sex,
                            birthmonth: registration.birthmonth,
                            mandatory_approvals: registration.mandatory_approvals,
                            sizeId: registration.sizeId,
                            via: registration.via,
                            medical: registration.medical,
                            gsm_guardian: registration.gsm_guardian,
                            email_guardian: registration.email_guardian,
                            general_questions: registration.general_questions
                        },
                        registration.project_code,
                        registration.id
                    );
                    userId = participant.id
                } else {
                    // create user with project
                    const owner = await this.createUserWithProject(
                        {
                            language: registration.language,
                            postalcode: registration.postalcode,
                            email: registration.email,
                            gsm: registration.gsm,
                            firstname: registration.firstname,
                            lastname: registration.lastname,
                            sex: registration.sex,
                            birthmonth: registration.birthmonth,
                            mandatory_approvals: registration.mandatory_approvals,
                            sizeId: registration.sizeId,
                            via: registration.via,
                            medical: registration.medical,
                            gsm_guardian: registration.gsm_guardian,
                            email_guardian: registration.email_guardian,
                            general_questions: registration.general_questions,
                            project: {
                                project_name: registration.project_name,
                                project_descr: registration.project_descr,
                                project_type: registration.project_type,
                                project_lang: registration.project_lang,
                                max_voucher: MAX_VOUCHERS
                            }
                        },
                        registration.id
                    );
                    userId = owner.id;
                }
                // return the newly created user
                return await this.getUser(userId);
            }
        );
    }

    /**
     * @param {string} password - unencrypted password
     * @returns {string}
     */
    generatePwd(password) {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        return hash
    }

    /**
    * Create a new user with a project
    * @param {Object} userProject - UserProject object
    * @returns {Promise<User>}
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
        const user = await User.create(userProject, { include: ['project'] });
        await Registration.destroy({ where: { id: registrationId } });
        return user;
    }

    /**
     * Create a new user with a token
     * @param {Object} user - User object 
     * @param {Number} voucherId - voucher id
     * @returns {Promise<User>}
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
        const voucher = await Voucher.findOne({ where: { id: voucherId, participantId: null }, lock: true });
        if (voucher === null) {
            throw new Error(`Token ${voucherId} not found`);
        }
        const user = await User.create(user);
        await voucher.setParticipant(user);
        await Registration.destroy({ where: { id: registrationId } });

        return user;
    }

    /**
     * Update user information
     * @param {User} user
     * @param {Number} userId
     * @returns {Promise<Boolean>} updated successfully
     */
    async updateUser(changedFields, userId) {
        var user = await User.findByPk(userId);
        return await user.update(changedFields);
    }

    /**
     * Get registration information
     * @param {Number} registrationId
     * @returns {Promise<Registration>} created registration
     */
    async getRegistration(registrationId) {
        return await Registration.findByPk(registrationId);
    }

    /**
     * Delete a user
     * @param {Number} userId
     * @returns {Promise<Boolean>} Delete ok ?
     */
    async deleteUser(userId) {
        const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
        if (project === null) {
            throw new Error('Project not found');
        }
        const usedVoucher = await Voucher.count({ where: { projectId: project.id, participantId: { [Op.ne]: null } } });
        if (usedVoucher > 0) {
            throw new Error('Delete not possible tokens in use');
        }
        return await User.destroy({ where: { id: userId } });
    }

    /**
     * create a project and assign to existing user
     * @param {Object} project
     * @returns {Promise<Project>} created account
     */
    async createProject(project, userId) {
        project.ownerId = userId;
        return await Project.create(project);
    }

    /**
     * Create a Account (user for admin panel & jury)
     * @param {Object} account
     * @returns {Promise<Account>} account
     */
    async createAccount(account) {
        return await Account.create(account);
    }

    /**
     * Update a project
     * @param {Project} project 
     * @param {Number} userId
     * @returns {Promise<Boolean>} Delete ok ?
     */
    async updateProject(changedFields, userId) {
        const project = await Project.findOne({ where: { ownerId: userId } });
        return project.update(changedFields);
    }

    /**
     * @param {Number} userId
     * @returns {Promise<Boolean>} Is user allowed to be deleted ?
     */
    async isUserDeletable(userId) {
        await sequelize.transaction(
            async (t) => {
                var result = true;
                const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'], lock: true });
                if (project === null) {
                    throw Error("Project not found")
                }
                const usedVoucher = await Voucher.count({ where: { projectId: project.id, participantId: { [Op.ne]: null } }, lock: true });
                if (usedVoucher > 0) {
                    result = false;
                }
                return result
            }
        );
    }

    /**
     * Delete a project
     * @param {Number} userId 
     * @returns {Promise<Boolean>} delete ok 
     */
    async deleteProject(userId) {
        // delete project or voucher
        // only possible when there are no used vouchers
        await sequelize.transaction(
            async (t) => {
                const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'], lock: true });
                if (project !== null) {
                    const usedVoucher = await Voucher.count({ where: { projectId: project.id, participantId: { [Op.ne]: null } }, lock: true });
                    if (usedVoucher > 0) {
                        throw new Error('Delete not possible tokens in use');
                    }
                    // delete project
                    return await Project.destroy({ where: { ownerId: userId } });
                } else {
                    // delete voucher
                    return await Voucher.destroy({ where: { participantId: userId } });
                }
            }
        );
    }

    /**
     * Create a voucher for a project
     * @param {Number} projectId 
     * @returns {Promise<Voucher>} created voucher
     */
    async createVoucher(userId) {
        await sequelize.transaction(
            async (t) => {
                const project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'], lock: true });
                if (project === null) {
                    throw new Error('No project found');
                }

                var totalVouchers = await Voucher.count({ where: { projectId: project.id }, lock: true });
                if (totalVouchers >= project.max_voucher) {
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
            }
        );
    }

    /**
     * Delete a participant from a project
     * @param {Number} projectId 
     * @param {Number} participantId
     * @returns {Promise<Boolean>} delete successfully
     */
    async deleteParticipantProject(projectId, participantId) {
        return await Voucher.destroy({ where: { projectId: projectId, participantId: participantId } });
    }

    /**
     * Add participant to a project
     * @param {Number} userId 
     * @param {Number} voucherId 
     * @returns {Promise<User>} created participant
     */
    async addParticipantProject(userId, voucherId) {
        const voucher = await Voucher.findOne({ where: { id: voucherId, participantId: null }, lock: true });
        if (voucher === null) {
            throw new Error('Voucher not found');
        }
        await voucher.setParticipant(userId);
        return await voucher.getParticipant();
    }

    /**
     * Add registration
     * @param {Registration} registration
     * @returns {Promise<Registration>} created registration
     */
    async createRegistration(registration) {
        return await Registration.create(registration);
    }

    /**
     * Get registration
     * @param {Registration} registration
     * @returns {Promise<Registration>}
     */
    async getRegistration(registrationId) {
        return await Registration.findByPk(registrationId, { lock: true });
    }

    /**
     * Add registration
     * @param {Registration} registration
     * @returns {Promise<Registration>}
     */
    async getUser(userId) {
        return User.findByPk(userId);
    }

    /**
     * Add registration
     * @param {Registration} registration
     * @returns {Promise<Voucher>} list of vouchers for project
     */
    async getVouchers(userId) {
        var project = await Project.findOne({ where: { ownerId: userId }, attributes: ['id'] });
        let vouchers = [];
        if (project !== null) {
            vouchers = await Voucher.findAll({
                where: { projectId: project.id }, attributes: ['id'], include: [{
                    model: User,
                    as: 'participant',
                    attributes: ['firstname', 'lastname']
                }]
            });
        }
        return vouchers;
    }

    /**
     * get Project
     * @param {Registration} registration
     * @returns {Promise<Registration>} project information
     */
    async getProject(userId) {
        // first look for own project
        const project = await Project.findOne({
            where: { ownerId: userId }, include: [
                {
                    model: Voucher,
                    include: [
                        { model: User, as: 'participant', attributes: ['firstname', 'lastname', 'id'] }
                    ]
                },
                { model: User, as: 'owner', attributes: ['firstname', 'lastname'] }
            ]
        });
        // check other project via voucher
        if (project === null) {
            const voucher = await Voucher.findOne({ where: { participantId: userId }, attributes: ['projectId'] });
            if (voucher === null) {
                throw Error("Voucher not found")
            }
            project = await Project.findByPk(voucher.projectId, {
                include: [
                    {
                        model: Voucher,
                        include: [
                            { model: User, as: 'participant', attributes: ['firstname', 'lastname', 'id'] }
                        ]
                    },
                    { model: User, as: 'owner', attributes: ['firstname', 'lastname'] }
                ]
            });
        }
        return project;
    }

    /**
     * Check if email address exists in User records table
     * @param {String} email
     * @returns {Promise<Boolean>} 
     */
    async doesEmailExists(emailAddress) {
        const count = await User.count({ where: { email: emailAddress } });
        return count !== 0;
    }
    /**
     * Get user via email
     * @param {String} email
     * @returns {Promise<User>}
     */
    async getUsersViaMail(email) {
        return await User.findAll({
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
    }

    /**
     * Update token
     * @param {Number} userId
     * @returns {Promise<User>}
     */
    async updateLastToken(userId) {
        const user = await User.findByPk(userId);
        user.last_token = new Date();
        await user.save();
    }
}

module.exports = new DBA()