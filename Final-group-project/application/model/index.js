const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const MongoClient = mongodb.MongoClient;

const mongodb_uri = 'mongodb+srv://lovnesh:welcomeToSA3@sa3class.l2vy3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const db_name = 'web-atelier-project';
const collection_name = 'usi_hoot';

const model = {};


MongoClient
    .connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        model.db = client.db(db_name);
        model.usi_hoot = model.db.collection(collection_name);

        console.log("mongod running on ", mongodb_uri);
    })
    .catch(err => console.error(err));


exports.model = model;