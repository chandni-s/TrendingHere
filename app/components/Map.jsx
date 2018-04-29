import React from 'react';
import axios from 'axios';
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: props.markers,
      center: props.center,
      radius: 150
    }
    this.onCenterMarkerMounted = this.onCenterMarkerMounted.bind(this);
    this.handleMarkerDragEnd = this.handleMarkerDragEnd.bind(this);
  }

  // Try to get user's location
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          currentLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
        this.props.updateLocation({ lng: this._marker.getPosition().lng(), lat: this._marker.getPosition().lat()})
        this.props.loadMarkers('ye');
      })
    }
  }

  calculateDistance(locA, locB) {
    coordA = new google.maps.LatLng(locA.lat, locA.lng);
    coordB = new google.maps.LatLng(locB.lat, locB.lng);
    return (google.maps.geometry.spherical.computeDistanceBetween(coordA, coordB) / 1000)
  }

  onMapMounted(map) {
    this._map = map;
  }

  onCenterMarkerMounted(marker) {
    this._marker = marker;
  }

  // Keep track of where the map is centered
  handleCenterChanged() {
    this.setState({
      center: {
        lng: this._map.getCenter().lng(),
        lat: this._map.getCenter().lat(),
      }
    })
  }

  // Update current location when blue marker is dragged
  handleMarkerDragEnd() {
    this.setState({
      currentLocation: {
        lng: this._marker.getPosition().lng(),
        lat: this._marker.getPosition().lat()
      }
    })
    this.props.updateLocation({ lng: this._marker.getPosition().lng(), lat: this._marker.getPosition().lat()})
    this.props.loadMarkers();
  }

  render() {
    const mapContainer = <div style={{ position: 'absolute', height: '100%', width: '100%' }}></div>

    const markers = this.props.markers.map((marker, id) => {
      return (
        <Marker key={id} {...marker} onClick={() => this.props.onMarkerClick(marker)}>
          {marker.showInfo && (
            <InfoWindow onCloseclick={() => this.props.onMarkerClose(marker)}>
              <div>
                {/*<div className="row center-text">
                  <h5>{marker.title}</h5>
                </div>
                <p>{marker.description}</p>*/}
                {marker.infoContent}
              </div>
            </InfoWindow>
          )}
        </Marker>
      )
    })

    return (
      <GoogleMapLoader
        containerElement={mapContainer}
        googleMapElement={
          <GoogleMap
            ref={this.onMapMounted.bind(this)}
            defaultZoom={9}
            defaultCenter={{ position: { lat: 50, lng: 50 } }}
            center={this.state.center}
            onCenterChanged={this.handleCenterChanged.bind(this)}
            options={{ streetViewControl: false, mapTypeControl: false }}>
            <Marker ref={this.onCenterMarkerMounted} position={this.state.currentLocation} draggable={true} onDragend={this.handleMarkerDragEnd} icon={'http://i.imgur.com/R6Q6FYK.png'} />
            {markers}
          </GoogleMap>
        }
      />
    )
  }
}