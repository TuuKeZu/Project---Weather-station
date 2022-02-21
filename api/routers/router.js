const express = require('express');
const router = express.Router();
const validator = require('../validation/validator')
const database = require('../database/database');

router.get('/get/now', async (req, res) => {

    try{

        let results = await database.getCurrent();

        res.json(results);
        
    } catch(e) {
        throw e;
    }
});

router.get('/get/hours/:hours', async (req, res) => {
    const result = validator.validateGetLastHoursRequest(req, res);

    if(result == null){ return; }

    try{

        let results = await database.getByHours(result.hours);

        res.json(results);

    } catch(e) {
        throw e;
    }
});

router.post('/set/current', async (req, res) => {
    const result = validator.validateSetCurrentRequest(req, res);

    if(result == null){ return; }

    const authentication = validator.validateToken(req, res, result.authentication);

    if(authentication == false){ return; }

    try{

        let results = await database.setCurrent(result.temperature);

        res.json(results);

    } catch(e) {
        throw e;
    }
});

router.post('/set/hour', async (req, res) => {
    const result = validator.validateSaveLastHour(req, res);

    if(result == null){ return; }

    const authentication = validator.validateToken(req, res, result.authentication);

    if(authentication == false){ return; }

    try{

        let results = await database.addToHourlyHistory(result.temperature);

        res.json(results);

    } catch(e) {
        throw e;
    }
});


module.exports = router;