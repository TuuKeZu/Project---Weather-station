const Joi = require('joi');
const requests = require('./requests');
const DATABASE_CONFIG = require('../database/database.json');

const validator = {
    validateGetByDateRequest: (req, res) => validateRequestParameters(req, res, requests.getTemperatureByDate),
    validateGetLastHoursRequest: (req, res) => validateRequestParameters(req, res, requests.getLastHours),
    validateSetCurrentRequest: (req, res) => validateRequestBody(req, res, requests.setTemperatureCurrent),
    validateSaveLastHour: (req, res) => validateRequestBody(req, res, requests.setTemperatureLastHour),
    validateToken: (req, res, token) => validateToken(req, res, token)
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

const validateToken = (req, res, token = String) => {
    const authentication = (token == DATABASE_CONFIG.authentication_token);

    if(!authentication){
        res.status(401).send('Access Denied - Invalid authentication-token.');
        return false;
    }

    return true;
}

module.exports = validator;