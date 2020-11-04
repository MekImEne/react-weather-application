import React, { Component } from 'react';
import {Map,InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

/**
 * Component of the Map that show the searched city position
*/

const mapStyles = {
    map: {
      position: 'absolute',
      width: '490px',
      height: '400px',
    }
};

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            // get the coords from parent (App)
            latitude : this.props.cityPosition.lat,
            longitude : this.props.cityPosition.lon,               
        }
    }

    onMarkerClick = (props, marker, e) =>
        this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
    } 
    );

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
    
    // recenter the map when the searched city is changed
    componentDidUpdate(prevState) {   
        if  ((prevState.latitude !== this.state.latitude) || (prevState.longitude !== this.state.longitude) )  {
            this.recenterMap(); // TO FIX :'(
        }
    }
    
    render() {
        let {latitude, longitude} = this.state;
        const style = Object.assign({}, mapStyles.map);
        return (  
            <Map 
                initialCenter={{ lat:latitude, lng: longitude}}    
                style={style} 
                google={this.props.google} 
                zoom={4}
            >    
                <Marker 
                    position={{ lat:latitude, lng: longitude}} 
                    onClick={this.onMarkerClick} 
                    name={'Searched City'} 
                />
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                </InfoWindow>
            </Map>           
        );
    }
}
export default GoogleApiWrapper({
  apiKey: ('GOOGLE_API_Key')
})(MapContainer)