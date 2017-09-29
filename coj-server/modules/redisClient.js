const redis = require('redis');
const redisClient = redis.createClient();

function set(key, value, callback) {
    redisClient.set(key, value, (error, data) => {
       if (error) {
           console.log(error);
           return;
       }
       callback(data);
    });
}

function get(key, callback) {
    redisClient.get(key, (error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        callback(data);
    })
}

function expire(key, timeToLive) {
    redisClient.expire(key, timeToLive);
}

function quit() {
    redisClient.quit();
}

module.exports = {
    set: set,
    get: get,
    expire: expire,
    quit: quit,
    print: redis.print
};