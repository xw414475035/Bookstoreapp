var models = require('../mongooseModels');
var common = require('./common');


module.exports = {
    findOrCreateUser: function (req, res) {
        const profile = req.body;
        const provider = profile.sub.split("|")[0];
        const authId = profile.sub.split("|")[1];
        const email = req.user['http://warriors.com/email'] ? req.user['http://warriors.com/email'] : '';
        if (!provider || !authId) return common.errorHandler('No provider or authId', res);
        models.user.findOne({provider: provider, authId: authId}, function (err, user) {
            if (err) return common.errorHandler(err, res);
            //if not found, create a user
            if (!user) {
                user = new models.user ({
                    authId: authId,
                    provider: provider,
                    name: profile.name || '',
                    email: email,
                    picture: profile.picture || '',
                    isAdmin: profile[process.env.NAMESPACE].indexOf('admin') > -1,
                    update_at: profile.update_at
                });
            } else {
                //if found, update some info
                user.email = email;
                user.picture = profile.picture || '';
                user.update_at = profile.update_at;
            }
            //update current user info
            user.save(function (err, savedUser) {
                if (err) return common.errorHandler(err, res);
                req.userDetail = savedUser;
                res.send(savedUser);
            });
        });
    },
    updateUsers: function (req, res) {
        const userInfo = req.body;
        const provider = req.user.sub.split('|')[0];
        const authId = req.user.sub.split('|')[1];
        if (!provider || !authId || !userInfo) return common.errorHandler('No provider or authId or userInfo', res);
        models.user.findOne({provider: provider, authId: authId}, function (err, user) {
            if (err) return common.errorHandler(err, res);
            if (user) {
                if (userInfo.name) user.name = userInfo.name;
                if (userInfo.phone) user.phone = userInfo.phone;
                if (userInfo.address) user.address = userInfo.address;
                user.save(function (err, savedUser) {
                    if (err) return common.errorHandler(err, res);
                    res.send(savedUser);
                });
            }
        });
    },
    getAllUsers: function (req, res) {
        models.user.find().lean().exec(function (err, users) {
            if (err) return common.errorHandler(err, res);
            res.send(users);
        });
    }
};