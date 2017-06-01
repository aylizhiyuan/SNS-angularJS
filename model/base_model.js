/**
 * Created by hama on 2017/6/1.
 */
let tools = require('../common/tools');
module.exports = function (schema) {
    schema.methods.create_time_ago = function () {
        return tools.formatDate(this.create_time, true);
    };

    schema.methods.update_time_ago = function () {
        return tools.formatDate(this.update_time, true);
    };
};