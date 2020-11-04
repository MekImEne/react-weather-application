import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/Current.css';
import Clock from "react-live-clock";
import apiKey from './ApiKey'

/**
 * Component to get the weather forecast according to the GPS position
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

const mapStyles = { // customize the style of map
  map: {
    position: 'absolute',
    width: '500px',
    height: '300px',
  }
};

export class CurrentLocation extends React.Component {
  constructor(props) {
    super(props); 
    const { lat, lng } = this.props.initialCenter;   
    this.state = {
      currentLocation: { //user geolocation
        lat: lat,
        lng: lng
      },
      // weather details forecast
      temperatureC: undefined,
      humidity: undefined,
      description: undefined,
      city: undefined,
      country: undefined,  
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) { //get our map on the page if Google Maps API is available.
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) { //recenter the map if the location changes.
      this.recenterMap();
    }
  }

  /**
   * A function to recenter the map according to current position 
   * it is called when the currentLocation in the component’s state is updated. 
   */  
  recenterMap() {
    const map = this.map;
    const current = this.state.currentLocation;
    const google = this.props.google;
    const maps = google.maps;
    if (map) {
      let center = new maps.LatLng(current.lat, current.lng);
      map.panTo(center); // method to change the center of the map
    }
  }

  // A function to get the geolocalisation of the user from the navigator
  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  componentDidMount() { // Set a callback to fetch the current location and the weather.
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        this.getPosition()
          //If user allow location service then will fetch data & send it to get-weather function.
          .then((position) => {
            const coords = position.coords;
            this.setState({
              currentLocation: {
                lat: coords.latitude,
                lng: coords.longitude
              }
            });
            this.getWeatherCurrentPosition(coords.latitude,coords.longitude);
          })
          .catch((err) => {
            //If user denied location service then standard location weather will le shown on basis of latitude & latitude.
            alert(
              "You have disabled location service. Allow 'Weather' application to access your location. Your current location will be used for calculating Real time weather."
            );
          });
      } else {
        alert("Geolocation not available");
      }
    }
    this.loadMap();
    this.timerID = setInterval(
      () => this.getWeatherCurrentPosition(this.state.lat, this.state.lon),
      300000
    );   
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  
  getWeatherCurrentPosition = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKey.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKey.key}`
    );
    const data = await api_call.json();
    this.setState({
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: data.main.temp,
      humidity: data.main.humidity,
      country: data.sys.country,
    });
  };


  loadMap() {
    if (this.props && this.props.google) {
      // checks if google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;

      // reference to the actual DOM element
      const node = ReactDOM.findDOMNode(mapRef);

      let { zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);

      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      );
      // maps.Map() is constructor that instantiates the map
      this.map = new maps.Map(node, mapConfig);
    }
  }

  renderChildren() { //Parent-Child component communication to call the method on the child component
    const { children } = this.props;
    if (!children) return;
    
    return React.Children.map(children, c => {
      if (!c) return;

      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    });
  }


  render() {
    const style = Object.assign({}, mapStyles.map);
    return (
      <React.Fragment>
        <div className="forecast-body">
          <div className="current-wrapper">
              <div className="current-main">
                  <div className="current-time">
                      <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                  </div>
                  <div className="current-date">{dateBuilder(new Date())}</div>                
              </div>             
              <div className="current-additional">
                  <div className="current-city">{this.state.city} , {this.state.country}</div>
                  <div className="current-temp">{this.state.temperatureC}&#176;C</div>
                  <div className="current-humidity">Humidity : {this.state.humidity}%</div>
                  <div className="current-descr">{this.state.description}</div>
              </div>            
          </div>
        </div>
        <div>
          <div style={style} ref="map">
            Loading map...
          </div>
          {this.renderChildren()}
        </div>
      </React.Fragment>     
    );
  }
}
export default CurrentLocation;

/**
 * default props to set the map with a center in case the current location is not provided. 
*/

CurrentLocation.defaultProps = {
  zoom: 8,
  initialCenter: {
    lat: 36.7525,
    lng: 3.04197
  },
  centerAroundCurrentLocation: false,
  visible: true
};