/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "get /": {
    view: "pages/homepage",
    locals: { isLoggedIn: false, username: "" },
  },

  // Api
  // "get /api/todo/list": { action: "api/Todo/list" }, // get list todo
  // "post /api/todo/add": { action: "api/Todo/storeAdd" }, // add todo
  // "get /api/todo/:id": { action: "api/Todo/findWorkById" }, // get todo by id
  // "post /api/todo/edit/:id": { action: "api/Todo/storeEdit" }, // edit todo
  // "get /api/todo/delete/:id": { action: "api/Todo/destroy" }, // delete todo

  // web
  "get /login": { view: "pages/login",},
  "get /signup": { view: "pages/signup",},

  "post /login": { action: "User/postLogin" },
  "post /signup": { action: "User/postSignUp" },
  "post /logout": { action: "User/logout"},
  "post /refreshToken": { action: "User/refreshToken" },
  "post /user/verifyOTP": { action: "User/verifyOTP"},
  
  "post /todo/list": { action: "Todo/list" }, // get list todo
  "post /todo/add": { action: "Todo/storeAdd" }, // add todo
  "post /todo/edit/:id": { action: "Todo/storeEdit" }, // edit todo
  "get /todo/delete/:id": { action: "Todo/destroy" }, // delete todo
  // "get /todo/edit/:id": { action: "Todo/edit" },
  // "get /todo/add": { action: "Todo/add" },


  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
