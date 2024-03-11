const {Redis} = require('ioredis');

const client = new Redis({
    port: 6379,
    host: "quectolink-cache-1"
}); 

//const client = new Redis()  use this when you are not using docker

module.exports = client;
