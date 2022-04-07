/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    username: {
      type: "string",
      required: true
    },
    password: {
      type: "string",
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
    },
    deviceToken: {
      type: 'string',
    },
		token: {
			collection: 'token',
			via: 'owner'
		},
    todos: {
      collection: 'todo',
      via: 'owner'
    },
    isVerified: {
      type: 'boolean',
      defaultsTo: false,
    }
  },
};
