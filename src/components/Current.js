import React from 'react';
import '../styles/Current.css';
import Clock from "react-live-clock";

/**
 *  <function to display current weather in this day>
*/

/**
 * <function permit to build today date and current time >
 * @param {object} d <refer to a day>
 * @returns {String} <a string of builded full date>
*/
const dateBuilder = (d) => {
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December",];
    let days = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday",];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear(); 
    return `${day}, ${date} ${month} ${year}`;
};
  

function Current (props) {
    let {temp, icon, humidity, description} = props.item;
    let kelvinToCelsius = temp => {
        return Math.floor(temp - 273.15) // convert the temperature from Kelvin to Celsius
    } 
    return (
        <div className="current-wrapper">
            <div className="current-main">
                <div className="current-time">
                    <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>              
            </div>             
            <div className="current-additional">        
                <div className="current-temp">{kelvinToCelsius(temp)}&#176;C</div>
                <div className="current-humidity">Humidity : {humidity}%</div>
                <div className="current-descr">{description}
                    <div className="current-image">
                        <img alt="" src = {`https://openweathermap.org/img/wn/${icon}.png`}/>  
                    </div>                   
                </div>               
            </div>
        </div>
    )
}
export default Current;