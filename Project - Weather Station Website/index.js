document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});

const Initialize = () => {

    getCurrent();

    setInterval(() => {
        getCurrent();
    }, 30000);

}

const updateWeatherData = (data = {}) => {
    const TEMP_TEXT = document.getElementById('TEMP-CURRENT');
    const TEMP_RAW_TEXT = document.getElementById('TEMP-RAW');
    const TEMP_STATUS = document.getElementById('LAST-UPDATED');

    let temp = Math.round(data[0].temperature * 10) / 10;
    let temp_raw = data[0].temperature;
    let last_modified = new Date(0);

    last_modified.setUTCMilliseconds(Date.parse(data[0].last_modified));

    TEMP_TEXT.textContent = `${temp}°C`;
    TEMP_RAW_TEXT.textContent = `${temp_raw}°C`
    TEMP_STATUS.textContent = `'${last_modified}'`;

    console.log('Successfully updated the current temperature.')
}

const getCurrent = async () => {
    const url = 'http://45.32.234.225:3000/api/get/now';

    fetch(url)
    .then(response => {
        response.json()
        .then(body => {
            updateWeatherData(body);
        });
    })
    .catch(err => {
        console.error(err);
    });
}

const getLastHour = async () => {
    const url = 'http://45.32.234.225:3000/api/get/now';

    fetch(url)
    .then(response => {
        response.json()
        .then(body => {
            updateWeatherData(body);
        });
    })
    .catch(err => {
        console.error(err);
    });
}