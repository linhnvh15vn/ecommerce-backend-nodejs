'use strict';

const { default: mongoose } = require('mongoose');
const { db } = require('../configs/mongodb.config');

const connectionString = `mongodb://${db.host}:${db.port}/${db.name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    if (true) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectionString)
      .then((_) => console.log('Mongo connection successful!'))
      .catch((err) => console.log(err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
