import React from 'react';
import { withRouter } from 'react-router-dom';
import {Items} from '../../model.js';
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';

class GeographicMap extends React.PureComponent {

  state = {
    places: []
  }

  static defaultProps = {
    center: {
      lat: 48.2348612,
      lng: 3.9936278
    },
    zoom: 4
  };

  componentDidUpdate(prevProps) {
    if (this.props.items !== prevProps.items) {
      this.props.conf.then((conf) => {
        let api_key = conf.interactiveMap || conf.staticMap;
        if (api_key) {
          let addresses = new Items(this.props.items).getAttributeValues('spatial');
          this._fetchPlaces(api_key, addresses);
          this.setState({ api_key, interactive: !!conf.interactiveMap });
        }
      });
    }
  }

  render() {
    if (!this.state.places.length || !this.state.api_key) return null;
    if (this.state.interactive) return (
      <div className="Map" style={{ height: '480px', width: '100%' }}>
        <GoogleMapReact
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          bootstrapURLKeys={{key: this.state.api_key}}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this._renderMarkers(map, maps)}
        />
      </div>
    );
    let alt = this.state.places.map(x => x.spatial).join(';');
    let markers = this.state.places.map(x => `${x.lat},${x.lng}`)
      .join('|');
    return (
      <img alt={alt}
        src={`https://maps.googleapis.com/maps/api/staticmap?size=640x480&markers=${markers}&key=${this.state.api_key}`}
      />
    );
  }

  _renderMarkers = (map, maps) => this.state.places.map(
    x => new maps.Marker({
      position: { lat: x.lat, lng: x.lng},
      map,
      title: x.spatial
    }).addListener('click', () => {
      let uri = `/?t={"type":"intersection","data":[{"type":"intersection","selection":["spatial : ${x.spatial}"],"exclusion":[]}]}`;
      this.props.history.push(uri);
    })
  );

  _fetchPlaces = (key, addresses) => {
    Geocode.setApiKey(key);
    return Promise.all(addresses.map(address =>
      Geocode.fromAddress(address).then(x => {
        const { lat, lng } = x.results[0].geometry.location;
        return {
          place_id: x.results[0].place_id,
          spatial: address,
          lat,
          lng
        };
      })
        .catch(x => console.error(x))
    ))
      .then(x => x.filter(x => !!x))
      .then(places => this.setState({places}))
  }

}

export default withRouter(GeographicMap);
