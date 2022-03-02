document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});

const menu = {
    active: false
}

const Initialize = () => {
    initializeButtons();
    getCurrent();

    setInterval(() => {
        getCurrent();
    }, 30000);

    getChartData();
}

const initializeButtons = () => {
    document.getElementById('RETURN').addEventListener('click', () => { onClick('RETURN'); })
    document.getElementById('OPEN').addEventListener('click', () => { onClick('GRAPH-OPEN'); })
}

const onClick = (action = String) => {
    const GRAPH_CONTAINER = document.getElementById('GRAPH-CONTAINER');

    switch(action){
        case 'RETURN':
            GRAPH_CONTAINER.style.display = 'none';
            menu.active = false;
            break;
        case 'GRAPH-OPEN':
            GRAPH_CONTAINER.style.display = 'flex';
            menu.active = true;
            break;
    }
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


const drawGraph = async (data = []) => {

    const WEEKDAYS = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }

    let xValues = [];
    let yValues = [];
    
    data.forEach((dataPoint, index) => {
        yValues.push(Number.parseFloat(dataPoint.temperature))
        const date = new Date(Date.parse(dataPoint.date));
        xValues.push(`${WEEKDAYS[date.getDay()]} ${formatAMPM(date)}`)
    });


    Chart.defaults.global.defaultFontColor = 'white'
    
    new Chart("CHART", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: 'Temperature',
                pointRadius: 3,
                pointBackgroundColor: "aqua",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderColor: "rgba(0, 0, 0, 0.3)",
                data: yValues
            }]
        },
        options: {
            resposive: true,
            title: {
                display: true,
                text: 'Observed temperature for the last 48h',
                color: 'white'
            },
            legend: {
                display: false,
            },
            scales: {
                xAxes: [],
                yAxes: [{ticks: {min: -20, max:20}}],
            }
        }
    });

}

const getCurrent = async () => {
    const url = 'https://lastrun.app:3000/api/get/now';

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

const getChartData = async () => {
    const url = 'https://lastrun.app:3000/api/get/hours/48';

    fetch(url)
    .then(response => {
        response.json()
        .then(body => {
            drawGraph(body);
        });
    })
    .catch(err => {
        console.error(err);
    });
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}