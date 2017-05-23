/**
 * Created by hama on 2017/5/23.
 */
//连接redis的命令
const SETTING = require('../setting');
const redis = require('redis');
const client = redis.createClient(SETTING.redis_port, SETTING.redis_host);
client.auth(SETTING.redis_psd);
module.exports = client;