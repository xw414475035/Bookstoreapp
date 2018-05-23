//common backend functions goes here
module.exports = {
    errorHandler: function (err, res) {
        console.log('ERROR OCCURRED: ' + message);
        res.redirect('/error');
    }
};