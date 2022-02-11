const mysql = require('mysql');
const CONFIG = require('../config.json');
const DATABASE_CONFIG = require('./database.json');

const pool = mysql.createPool({
    connectionLimit: CONFIG['max-connections'],
    password: DATABASE_CONFIG.password,
    user: DATABASE_CONFIG.user,
    database: DATABASE_CONFIG.database,
    host: DATABASE_CONFIG.host,
    port: DATABASE_CONFIG.port
});

module.exports = 
{
    // Returns the last recorded temperature.
    getCurrent: () => {
        return new Promise((resolve, reject) => {
            const query_select = 'SELECT * FROM current';
            pool.query(query_select, (err, results) => {

                if(err){
                    return reject(err);
                }

                return resolve(results);
            });
        });
    },

    // Returns a list of temperatures for 'n'-number of hours.
    getByHours: (hours) => {
        return new Promise((resolve, reject) => {
            const query_select = 'SELECT * FROM hourly_history WHERE date > now() - interval ? hour AND date < now();';
            pool.query(query_select, [hours], (err, results) => {

                if(err){
                    return reject(err);
                }

                return resolve(results);
            });
        });
    }
}

