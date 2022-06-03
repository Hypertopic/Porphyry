import React from 'react';
import { withRouter } from 'react-router-dom';
import { Items } from '../../model.js';
import { GoogleMap, GroundOverlay, Marker, LoadScript } from '@react-google-maps/api';
import memoize from 'mem';
import Selection from '../../Selection.js';
import { Trans } from '@lingui/macro';

class GeographicMap extends React.PureComponent {

  state = {
    places: [],
    layers: [],
    sliderValue: 70
  }

  componentDidUpdate(prevProps) {
    if (this.props.items !== prevProps.items) {
      this.props.conf.then((conf) => {
        if (conf.map) {
          let api_key = conf.map.key;
          let geocoding_uri = conf.map.geocodingService;
          if (api_key && geocoding_uri) {
            this.setState({ api_key, geocoding_uri });
            let addresses = new Items(this.props.items).getAttributeValues('spatial');
            this._fetchPlaces(addresses);
          }
          let portfolio = conf.portfolio;
          if (portfolio && portfolio[conf.user]) {
            let layers = portfolio[conf.user].layers || [];
            this.setState({ layers });
          }
        }
      });
    }
  }

  render() {
    if (!this.state.places.length || !this.state.api_key) return null;
    let markers = this.state.places.map(({ position, place_id, spatial }) =>
      <Marker key={spatial}
        position={position}
        onClick={() => this.handleClick(place_id)}
      />
    );
    let layers = this.state.layers.map(layer =>
      <GroundOverlay key={layer.uri} url={layer.uri} bounds={layer.bounds} opacity={this.state.sliderValue / 100} />
    );
    let center = this.bounds ? this.bounds.getCenter : { lat: 0, lng: 0 };
    return (
      <>
        <LoadScript googleMapsApiKey={this.state.api_key} >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={center}
            zoom={2}
            onLoad={this.handleLoad}
          >
            {layers}
            {markers}
          </GoogleMap>
        </LoadScript>
        <div className="sliderProperties"><Trans>Opacité du calque&nbsp;</Trans><input type="range" min="1" max="100" value={this.state.sliderValue} className="slider" id="opacitySlider" onChange={this.handleSlider}></input>{this.state.sliderValue}%</div>
      </>
    );
  }

  handleSlider = (e) => {
    this.setState({
      sliderValue: e.target.value
    });
  }

  handleLoad = (map) => {
    this.bounds = new window.google.maps.LatLngBounds();
    this.state.places.forEach(({ position }) =>
      this.bounds.extend(new window.google.maps.LatLng(position.lat, position.lng))
    );
    map.fitBounds(this.bounds);
  }

  handleClick = (place_id) => {
    let place = this.state.places.find(x => x.place_id === place_id);
    let uri = new Selection(`spatial : ${place.spatial}`).toURI();
    this.props.history.push(uri);
  }

  fromAddress = memoize((address) => fetch(`${this.state.geocoding_uri}?address=${address}&key=${this.state.api_key}`)
    .then(x => x.json())
    .then(x => {
      return {
        place_id: x.results[0].place_id,
        spatial: address,
        position: x.results[0].geometry.location
      };
    })
    .catch(x => console.error(x))
  );

  _fetchPlaces = (addresses) => {
    return Promise.all(addresses.map(this.fromAddress))
      .then(x => x.filter(x => !!x))
      .then(places => this.setState({ places }));
  }

}

export default withRouter(GeographicMap);
