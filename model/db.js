/**
 * Created by hama on 2017/5/9.
 */
const mongoose = require('mongoose');
const setting = require('../setting');
mongoose.connect(`mongodb://${setting.host}/${setting.db}`);