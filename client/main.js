const fs = require('fs');
const request = require('request');
const CONFIG = require('./config.json');
const AUTHENTICATION = require('./authentication.json');
const Moment = require('moment');

const RECORDS = [];
let ONLINE = true;

const Initialize = () => {
    console.log("Initializing weather tick...");
    // Start the Interval
    const onWeatherTick = setInterval( async function() {

        // Executes every 10s
        try
        {
            
            const data = await readDataFromTemperatureSensor();
            const hourly = appendHourlyData( parseData(data) );


            
            if(ONLINE)
            {

                // Upload files to server if ONLINE
                try{
    
                    const uploaded = await uploadDataToServers(parseData(data), 'CURRENT');
    
                    console.log("Successfully updated the current temperature")
    
                } catch(e) {
                    connectionError(e);
                    return;
                }

                if(hourly != null){
                    
                    try{
        
                        const uploaded = await uploadDataToServers(parseData(data), 'HOUR');
        
                        console.log("Successfully saved last hour's data to database.")
        
                    } catch(e) {
                        connectionError(e);
                        return;
                    }
                }

            }
            // Save files locally if OFFLINE
            else
            {
                if(hourly != null){
                    saveDataLocally(hourly);
                }
            }


        } catch(e)
        {
            throw(e);
        }
    
        
    
    }, CONFIG.interval);

}

const readDataFromTemperatureSensor = () => {

    return new Promise((resolve, reject) => {

        // Read temperature data from Raspberry Pi 4 directory
        fs.readFile(CONFIG['data-path'], 'utf8', (err, data) => {

            if(err) return reject(err);

            return resolve(data);
        });

    });
}

const uploadDataToServers = (temperature = String, type = String) => {

    return new Promise((resolve, reject) => {
        let url = '';

        switch(type){
            case 'CURRENT':
                url = `${CONFIG['api-path']}current`;
                break;
            case 'HOUR':
                url = `${CONFIG['api-path']}hour`;
                break;
            default:
                return reject(400);
        }

        const data = {
            json: {
                temperature: temperature,
                authentication: AUTHENTICATION.token
            }
        }


        request.post(url, data, (err, res, body) => {

            if(err){
                
                return reject(err.errno);
            }

            if(res.statusCode != 200){
                return reject(res.statusCode);
            }

            return resolve(body);

        });


    });
}

const appendHourlyData = (data) => {
    RECORDS.push(data);

    const hourly = RECORDS.length == 60;

    if(hourly){
        let average_temp = 0;

        RECORDS.forEach(temp => {
            average_temp += Number.parseFloat(temp);
        });

        average_temp /= RECORDS.length;

        RECORDS.splice(0, RECORDS.length);

        return average_temp;
    }


    return null;
}

const saveDataLocally = (temperature) => {
    const logger = fs.createWriteStream(CONFIG['auto-save-path'], {flags: 'a'});

    let dateTime = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    logger.write(`${temperature},${dateTime}\n`);
    logger.end();
}

const parseData = (raw = String) => {
    let data_split = raw.toString().trim().split('t=');
    let temperature = Number.parseInt(data_split[1]) / 1000;

    return `${temperature}`;
}

const connectionError = (error) => {
    console.log('Connection Error occured');
    console.log(error);

    ONLINE = false;
}


Initialize();