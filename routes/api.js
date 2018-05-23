const express = require('express');
const router = express.Router();

//self defined modules
const middleware = require('./middlewares');
const user = require('./userController');

module.exports = function () {
    router.post('/api/findOrCreateUser', middleware.ensureAuthenticated, user.findOrCreateUser);
    router.get('/api/getAllUsers', middleware.ensureAuthenticated, user.getAllUsers);
    router.put('/api/updateUser', middleware.ensureAuthenticated, user.updateUsers);
    return router;
};