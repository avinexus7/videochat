module.exports = {
  redis: {
    host: process.env.REDISHOST || 'localhost',
    port: process.env.REDISPORT || 6379
  },
  mongo: {
    database: 'yangroulette',
    host: process.env.MONGOHOST || 'localhost',
    port: process.env.MONGOPORT || 27017
  },
  port: process.env.PORT || 3000
}
