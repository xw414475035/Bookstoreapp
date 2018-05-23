// grab the things we need
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment-fix');
var Schema = mongoose.Schema;
var models = {};

// create a schema
var userSchema = new Schema({
    name: String,
    email: String,
    authId: String,
    provider: String,
    picture: String,
    phone: Number,
    address: String,
    isAdmin: {type: Boolean, default: false},
    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
}, {collection: 'userCollection'});

var bookSchema = new Schema({
    googleID: String,
    selfLink: String,
    title: String,
    subTitle: String,
    authors: [String],
    publisher: String,
    publishedDate: String,
    description: String,
    industryIdentifiers: [{type: String, identifier: Number}],
    pageCount: Number,
    categories: [String],
    imageLinks: String,
    previewLink: String,
    saleability: Boolean,
    price: Number,
    webReaderLink: String
}, {collection: 'bookCollection'});

var orderSchema = new Schema({
    buyer: [{type: Number, ref: 'user'}],
    books: [{type: Number, ref: 'book'}],
    update_at: { type: Date, default: Date.now }
}, {collection: 'orderCollection'});

//using autoIncrement plugin to auto increment ids
userSchema.plugin(autoIncrement.plugin, 'user');
orderSchema.plugin(autoIncrement.plugin, 'order');
bookSchema.plugin(autoIncrement.plugin, 'book');

// the schema is useless so far
// we need to create a model using it
models.user = mongoose.model('user', userSchema);
models.order = mongoose.model('order', orderSchema);
models.book = mongoose.model('book', bookSchema);

// make this available to our users in our Node applications
module.exports = models;