var config = {
  db: {
    connectStringList: [
      'mongodb://127.0.0.1:27017/error/error'
    ]
  },
  redisSession: {
    app: 'wood',  // 所属总作用域
    cookie: {
      maxAge: 1000 * 60 * 300,
      path: '/',  // cookie路径
      httpOnly: true
    },
    host: 'localhost',
    port: 6379,
    //options: {
    //  password: '111111'
    //},
    namespace: '',  // redis key前缀
    ttl: 60 * 60,  // 过期时间，单位s，默认7200
    wipe: 60 * 10,  // 定期清除超时session间隔时间，单位s，默认600
    trustProxy: false  // 只接受https cookies
  },
  redisCache: {
    host: '10.0.0.80',
    port: 6379,
    //password: '111111',
    prefix: 'WOOD:',
    expireTime: (60 * 60 * 24) * 7  // 单位s
  }
};

module.exports = config;