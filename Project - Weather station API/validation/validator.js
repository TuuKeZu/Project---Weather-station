const Joi = require('joi');
const requests = require('./requests');

const validator = {
    validateGetByDateRequest: (req, res) => validateRequestParameters(req, res, requests.getTemperatureByDate),
    validateGetLastHoursRequest: (req, res) => validateRequestParameters(req, res, requests.getLastHours)
}

const validateRequestBody = (req, res, schema = {}) => {
    const result = schema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return null;
    }
    
    return result.value;
}

const validateRequestParameters = (req, res, schema = {}) => {
    const result = schema.validate(req.params);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return null;
    }

    return result.value;
}

module.exports = validator;