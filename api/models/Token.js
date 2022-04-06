/**
 * Token.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

    attributes: {
        token: {
            type: 'string'
        },
        // refreshToken: {
        //   type: 'string'
        // },
        owner: {
            model: 'user',
            unique: true
        },
        expire_time: {
            type: 'string',
            columnType: 'date'
        }
    },

}

