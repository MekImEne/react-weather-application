import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router , Route } from 'react-router-dom';
import CityInput from './components/CityInput';
import MapCurrent from './components/Map'
import MapSearchedCity from './components/MapSearchedCity'
import Header from './components/layouts/Header';
import Today from './components/pages/Today';
import Tomorrow from './components/pages/Tomorrow';
import Fiveday from './components/pages/Fiveday';
import loader from './images/WeatherIcons.gif';
import './styles/Current.css';
import apiKey from "./components/ApiKey";
  
class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      today: [],
      tomorrow: [],
      fiveday: [],
      isSearched: false,
      isError: false,
      isCityFound: false,
      searchedCity : '',
      searchedCountry: '',
      latitude : undefined,
      langitude: undefined,
      /// if it's a geolocation 
      location: false,
    };
  } 

  /**
   * Function to parse the Weather API Data for each day in the week
  */

  parseAPIData = result => {
    const today = []
    const tomorrow = []
    const fiveday = []
    const currentDay = new Date (result.list[0].dt_txt).getDay() // the current day is the first element returned

    const parseSingleItem = item => {
      const forecastItem = {  
        temp: item.main.temp,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        date: item.dt_txt,
      };

      const itemDay = new Date (item.dt_txt).getDay() 
      // Check what day is it and forecast the according weather
      if (itemDay === currentDay) {
        today.push(forecastItem);
      } else if (itemDay === currentDay + 1 ) {
        tomorrow.push(forecastItem);                 
      }
      if (new Date (item.dt_txt).getHours() === 12) {
        fiveday.push(forecastItem);
      }
    }

    result.list.forEach(parseSingleItem);

    this.setState({
      today,
      tomorrow,
      fiveday,
      isSearched: true,
      isCityFound: true,
      searchedCity: result.city.name,
      searchedCountry: result.city.country,
      // update the state of city position to update the map center
      latitude: result.city.coord.lat,
      langitude: result.city.coord.lon
    });
  }

  /**
   * Function to parse the weather of a searched city name
   * @param {String} name , the name of the city searched
  */
  getWeatherDataAndParse = name => {

    return fetch (`${apiKey.base}forecast?q=${name}&appid=${apiKey.key}`)
    .then (res=> res.json())
    .then(result => {
      if (result.cod === "404") { // no found results after searching
        this.setState({
          isSearched: true,
          isCityFound: false
        });
        return
      }

      if (result.cod !== "200"){
        return
      }
      
      this.parseAPIData(result); // if no error parse weather data
         
    }).catch((error) => {
      this.setState({
        isSearched:true,
        isError: true
      })
    })
  }

  render() {
    let main;
    let {today, tomorrow, fiveday, isSearched, isCityFound, isError, location, searchedCity, searchedCountry} = this.state;
    // the Home of application before activating GPS or searchin a city
    if (!isSearched && !location)  {
      return (
        <div className="app-container">      
          <div className="app-main"> 
            <div className="app-descr-wrapper">
              <img alt="" src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
              <div className="app-header">Weather Finder</div>
              <div className="main-message">Find out Real time weather ! just type the city you want !</div>   
            </div>
            <div className="buttonBlock">
              <button  onClick={() => this.setState({ location: false, isSearched:true})}  className="button">Search a city weather </button>   
              <button  onClick={() => this.setState({ location: true})} className="button">Current location weather</button> 
            </div>  
          </div>
        </div>
      ); 
    }

    // Case of Search for City weather
    
    if (isSearched && !isCityFound) {
      main = <div className="main-message" >No City is founded</div>
    } else if (isCityFound) {
      main = <div className="forecast-body">
        <Header/>
        <div className="current-city">{searchedCity} , {searchedCountry}</div>
        <Route
          exact path="/" render={props => (
            <Today items = {today} />
          )}
        />
        <Route
          exact path="/tomorrow" render={props => (
            <Tomorrow items = {tomorrow} />
          )}
        />
        <Route
          exact path="/fiveday" render={props => (
            <Fiveday items = {fiveday} />
          )}
        /> 
        <MapSearchedCity 
          cityPosition = {{ lat : this.state.latitude , lon : this.state.langitude}} 
        />   
      </div>
    } else if (isError) {
      main = <div className="main-message">Something went wrong</div>
    }

    // Case of Activating GPS
    
    if (location) {
      return (    
        <div className="app-container">      
          <div className="app-main">  
            <div className="forecast-body">      
              <MapCurrent/>
            </div> 
          </div> 
        </div>      
      );
    } else  {
      return (    
        <div className="app-container">      
            <div className="app-main">    
              <Router>
                <CityInput getWeatherDataAndParse={this.getWeatherDataAndParse} ></CityInput>                      
                {main}                     
              </Router>
            </div>
        </div>
      ) ;
    }
  }
}
export default App;