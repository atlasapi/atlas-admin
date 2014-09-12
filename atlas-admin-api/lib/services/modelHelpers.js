//  validate data against schema
//
//  @param schema {object} the model schema
//  @param data {object} real data to be validated
//         ex – { model_key: {type: 'string|object|number|boolean', required: true|false} }
var Validator = function(schema, data) {
    if ('object' !== typeof descriptor && 'object' !== typeof data) {
        throw new TypeError();
        return;
    }
    this.errors = [];
    for (var prop in schema) {
        if (typeof data[prop] !== schema[prop].type && schema[prop].required) {
            this.errors.push(prop);
        }
    }
    this.success = this.errors.length ? false : true;
    this.fail = this.errors.length ? true : false;
}

module.exports.Validator = Validator;