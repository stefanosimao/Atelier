/**
 * Web Atelier 2021  Exercise 6 - MongoDB
 *
 * Student: Stefano Gonçalves Simao
 *
 * Task 1
 *
 */

const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const MongoClient = mongodb.MongoClient;

const mongodb_uri = 'mongodb://localhost:27017';
const db_name = 'web-atelier-ex';
const collection_name = 'music';

const model = {};


MongoClient
    .connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        model.db = client.db(db_name);
        model.music = model.db.collection(collection_name);

        require('./sync').check(model.music, '/Users/stefanosimao/7-fetch-stefanosimao/music').then(console.log);

    })
    .catch(err => console.error(err));


exports.model = model;