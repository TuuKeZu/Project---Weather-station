const Joi = require('joi');

module.exports = 
{
    getLastHours: Joi.object(
    {
        hours: Joi.number().required().min(1).max(48),
        format: Joi.string().valid('CELCIUS', 'KELVIN', 'FAHRENHEIT').optional()
    }),
    getTemperatureByDate: Joi.object(
    {
        date: Joi.date().required(),
        format: Joi.string().valid('CELCIUS', 'KELVIN', 'FAHRENHEIT').optional()
    })
}