import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import CurrentLocation from './CurrentLocation';

/**
 * Component of the Map that show the GPD Position of the user
*/

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {    
      return (
        <CurrentLocation centerAroundCurrentLocation google={this.props.google} >

          <Marker onClick={this.onMarkerClick} name={'Current Location'} />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selectedPlace.name}</h4>
            </div>
          </InfoWindow>
        </CurrentLocation>
      ); 
  }
}
export default GoogleApiWrapper({
  apiKey: 'GOOGLE_API_Key'
})(MapContainer);