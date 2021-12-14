'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Accounts", deps: []
 * createTable "Attachments", deps: []
 * createTable "Awards", deps: []
 * createTable "AzureBlobs", deps: []
 * createTable "Certificates", deps: []
 * createTable "Events", deps: []
 * createTable "ExternVotes", deps: []
 * createTable "Hyperlinks", deps: []
 * createTable "Locations", deps: []
 * createTable "Projects", deps: []
 * createTable "ProjectTables", deps: []
 * createTable "Questions", deps: []
 * createTable "QuestionRegistrations", deps: []
 * createTable "QuestionTranslations", deps: []
 * createTable "QuestionUsers", deps: []
 * createTable "Registrations", deps: []
 * createTable "Sessions", deps: []
 * createTable "CountTshirtSizes", deps: []
 * createTable "Tables", deps: []
 * createTable "TShirts", deps: []
 * createTable "TShirtGroups", deps: []
 * createTable "TShirtGroupTranslations", deps: []
 * createTable "TShirtTranslations", deps: []
 * createTable "Users", deps: []
 * createTable "ShowUserWithNoProject", deps: []
 * createTable "userprojectvideo", deps: []
 * createTable "ShowAttachmentLoaded", deps: []
 * createTable "Votes", deps: []
 * createTable "VoteCategories", deps: []
 * createTable "Vouchers", deps: []
 * addIndex "azure_blobs_container_name_blob_name" to table "AzureBlobs"
 * addIndex "question_translations_question_id_language" to table "QuestionTranslations"
 * addIndex "t_shirt_group_translations_t_shirt_group_id_language" to table "TShirtGroupTranslations"
 * addIndex "t_shirt_translations_t_shirt_id_language" to table "TShirtTranslations"
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2021-12-01T10:24:43.067Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Accounts",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Attachments",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Awards",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "AzureBlobs",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Certificates",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Events",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "ExternVotes",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Hyperlinks",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Locations",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Projects",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "ProjectTables",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Questions",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "QuestionRegistrations",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "QuestionTranslations",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "QuestionUsers",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Registrations",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Sessions",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "CountTshirtSizes",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Tables",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "TShirts",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "TShirtGroups",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "TShirtGroupTranslations",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "TShirtTranslations",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "ShowUserWithNoProject",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "userprojectvideo",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "ShowAttachmentLoaded",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Votes",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "VoteCategories",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Vouchers",
            {

            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "AzureBlobs",
            ["container_name", "blob_name"],
            {
                "indexName": "azure_blobs_container_name_blob_name",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "QuestionTranslations",
            ["questionId", "language"],
            {
                "indexName": "question_translations_question_id_language",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "TShirtGroupTranslations",
            ["tShirtGroupId", "language"],
            {
                "indexName": "t_shirt_group_translations_t_shirt_group_id_language",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "TShirtTranslations",
            ["tShirtId", "language"],
            {
                "indexName": "t_shirt_translations_t_shirt_id_language",
                "indicesType": "UNIQUE"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
