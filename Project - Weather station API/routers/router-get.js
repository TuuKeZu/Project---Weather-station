const express = require('express');
const router = express.Router();
const validator = require('../validation/validator')
const database = require('../database/database');

router.get('/now', async (req, res) => {

    try{

        let results = await database.getCurrent();

        res.json(results);
        
    } catch(e) {
        throw e;
    }

    res.json({'status': 'success!'});
});

router.get('/hours/:hours', async (req, res) => {
    const result = validator.validateGetLastHoursRequest(req, res);

    if(result == null){ return; }

    try{

        let results = await database.getByHours(result.hours);

        res.json(results);

    } catch(e) {
        throw e;
    }
});


module.exports = router;