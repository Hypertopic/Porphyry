import React from 'react';
import { withRouter } from 'react-router-dom';
import {Items} from '../../model.js';
import { GoogleMap, GroundOverlay, Marker, LoadScript } from '@react-google-maps/api';
import Geocode from 'react-geocode';
import memoize from 'mem';

class GeographicMap extends React.PureComponent {

  state = {
    places: []
  }

  componentDidUpdate(prevProps) {
    if (this.props.items !== prevProps.items) {
      this.props.conf.then((conf) => {
        let api_key = conf.interactiveMap || conf.staticMap;
        if (api_key) {
          let addresses = new Items(this.props.items).getAttributeValues('spatial');
          this._fetchPlaces(api_key, addresses);
          this.setState({ api_key, interactive: !!conf.interactiveMap });
        }
        const portfolio = conf.portfolio;
        if (portfolio && portfolio[conf.user]) {
          const layers = portfolio[conf.user].layers;
          this.setState({ layers });
        }
      });
    }
  }

  render() {
    if (!this.state.places.length || !this.state.api_key) return null;
    if (this.state.interactive) {
      let markers = this.state.places.map(({position, place_id, spatial}) =>
        <Marker key={spatial}
          position={position}
          onClick={() => this.handleClick(place_id)}
        />
      );
      let center = this.bounds ? this.bounds.getCenter : {lat: 0, lng: 0};
      return (
        <LoadScript googleMapsApiKey={this.state.api_key} >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={center}
            zoom={2}
            onLoad={this.handleLoad}
          >
	          {this.state.layers && this.state.layers.map(
              layer => <GroundOverlay key={layer.uri} url={layer.uri} bounds={layer.bounds}></GroundOverlay>
            )}
            {markers}
          </GoogleMap>
        </LoadScript>
      );
    }
    let alt = this.state.places.map(x => x.spatial).join(';');
    let markers = this.state.places.map(({position}) => `${position.lat},${position.lng}`)
      .join('|');
    return (
      <img alt={alt}
        src={`https://maps.googleapis.com/maps/api/staticmap?size=640x480&markers=${markers}&key=${this.state.api_key}`}
      />
    );
  }

  handleLoad = (map) => {
    this.bounds = new window.google.maps.LatLngBounds();
    this.state.places.forEach(({position}) =>
      this.bounds.extend(new window.google.maps.LatLng(position.lat, position.lng))
    );
    map.fitBounds(this.bounds);
  }

  handleClick = (place_id) => {
    let place = this.state.places.find(x => x.place_id === place_id);
    let uri = `/?t={"type":"intersection","data":[{"type":"intersection","selection":["spatial : ${place.spatial}"],"exclusion":[]}]}`;
    this.props.history.push(uri);
  }

  fromAddress = memoize((address) => Geocode.fromAddress(address)
    .then(x => {
      return {
        place_id: x.results[0].place_id,
        spatial: address,
        position: x.results[0].geometry.location
      };
    })
    .catch(x => console.error(x))
  );

  _fetchPlaces = (key, addresses) => {
    Geocode.setApiKey(key);
    return Promise.all(addresses.map(this.fromAddress))
      .then(x => x.filter(x => !!x))
      .then(places => this.setState({places}));
  }

}

export default withRouter(GeographicMap);
