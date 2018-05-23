const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

//self defined modules
const models = require('../mongooseModels');
const common = require('./common');

module.exports = {
    //middleware config
    ensureAuthenticated: jwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: "https://warriors.auth0.com/.well-known/jwks.json"
        }),
        audience: process.env.AUTH0_API_AUDIENCE,
        issuer: "https://warriors.auth0.com/",
        algorithms: ['RS256']
    }),
    ensureAdmin: (req, res, next) => {
        const provider = req.user.sub.split("|")[0];
        const authId = req.user.sub.split("|")[1];
        if (!provider || !authId) return common.errorHandler('No provider or authId', res);
        models.user.findOne({provider: provider, authId: authId}, function (err, user) {
            if (err) common.errorHandler('Error occurred on fetching user' + err, res);
            if (user.isAdmin) {
                next();
            } else {
                res.status(401).send({message: 'Not authorized for admin access'});
            }
        });
    }
};