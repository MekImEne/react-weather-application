import React from 'react';
import '../styles/DailyAverage.css';

/**
 * A function to show the daily average of temperature
*/

function DailyAverage(props) {
    let daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let {date, temp, icon, humidity, description} = props.item;
    let kelvinToCelsius = temp => {
        return Math.floor(temp - 273.15)
    }
    return (
        <div className="daily-wrapper">
            <div className="daily-main">
                <div className="daily-date">{daysInWeek[new Date(date).getDay()]}, {months[new Date(date).getMonth()]} {new Date(date).getDate()}</div>
                <div className="daily-descr">{description}</div>
                <div className="daily-temp">{kelvinToCelsius(temp)}&#8451;</div>
            </div>
            <div className="daily-additional">
                <div className="daily-humidity">Humidity : {humidity}%</div>
                <div>
                    <img alt="" src = {"http://openweathermap.org/img/w/" + icon + ".png"} />
                </div>
            </div>
        </div>
    )
}
export default DailyAverage;