'use strict';
//  validate data against schema descriptor
//
//  schema descriptor example:
//  { model_key: {type: 'string|object|number|boolean', required: true|false} }
//
//  @param schema {object} the model schema
//  @param data {object} real data to be validated
//
var ValidateSchema = function(schema, data) {
    if ('object' !== typeof schema || 'object' !== typeof data) {
        throw new TypeError();
        return;
    }
    this.errors = [];
    for (var prop in schema) {
        if (schema[prop].hasOwnProperty('required')) {
            if (schema[prop].required && !data.hasOwnProperty(prop)) this.errors.push(prop);
        }
        if (schema[prop].hasOwnProperty('type')) {
            if (data.hasOwnProperty(prop)) {
                if (typeof data[prop] !== schema[prop].type) this.errors.push(prop);  
            }
        }
    }
    this.valid = this.errors.length ? false : true;
    this.invalid = !this.valid;
}

module.exports = {
    schema: ValidateSchema
}