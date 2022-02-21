const Joi = require('joi');

module.exports = 
{
    getLastHours: Joi.object(
    {
        hours: Joi.number().required().min(1).max(48)
    }),
    getTemperatureByDate: Joi.object(
    {
        date: Joi.date().required()
    }),
    setTemperatureCurrent: Joi.object({
        temperature: Joi.string().required(),
        authentication: Joi.string().length(20).required()
    }),
    setTemperatureLastHour: Joi.object({
        temperature: Joi.string().required(),
        authentication: Joi.string().length(20).required()
    })
}