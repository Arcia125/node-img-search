'use strict';

const config = {};

config.port = process.env.PORT || 3000;

config.db = {};
config.db.host = 'ds119608.mlab.com';
config.db.user = 'arc125';
config.db.pw = 'nailbeefiber';
config.db.port = 19608;
config.db.name = 'node-img-search';
config.db.url = `mongodb://${config.db.user}:${config.db.pw}@${config.db.host}:${config.db.port}/${config.db.name}`;

module.exports = config;
