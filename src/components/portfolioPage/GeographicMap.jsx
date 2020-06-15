import React from 'react';
import { Items } from '../../model.js';
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';
import Hypertopic from 'hypertopic';

var markers = [];
var items = [];

class GeographicMap extends React.PureComponent {
  // places are the adresses we get from spatial
  // locations are the geocordinates of the adresses from spatial

  state = {
    places: [],
    locations: [],
    initialItems: [],
    isMarkerClicked: false
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
        if (conf.dynamicmap) {
          let places = new Items(this.props.items).getAttributeValues('spatial');
          let geo_key = conf.geocoding;
          let api_key = { key: conf.dynamicmap };
          this.setState({ places, geo_key, api_key });
          let locations = this._convertAdressToCoordinates(this.state.geo_key, this.state.places);
          this.setState({ locations });
        }
      });
    }
  }

  render() {
    //Clear cache
    localStorage.clear();
    if (!this.state.places.length) return null;
    let isMarkerClicked = this.state.isMarkerClicked;
    return (
      <div>
        <div className="Map" style={{ height: '480px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={this.state.api_key}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this._renderMarkers(map, maps)}
          />
        </div>
        {!isMarkerClicked ? null
          : <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <button value="Unclick" onClick={this._handleClick} >
              Unclick Marker
            </button>
          </div>
        }
      </div>);
  }

  _handleClick = () => {
    let initialItems = this.props.initialItems;
    this.setState({ items: initialItems });
    this.props._updateItemsFromMarker(initialItems);
    this.setState({ isMarkerClicked: false });
  }

  _renderMarkers = async (map, maps) => {
    var self = this;
    if (markers.length === 0) {
      this.state.locations.forEach(elt => {
        let marker = new maps.Marker({
          position: { lat: elt.lat, lng: elt.lng },
          map,
          title: elt.spatial
        });
        marker.addListener('click', async function () {
          self.setState({ isMarkerClicked: true });
          items = await self._fetchItems(elt.spatial);
          self.setState({ items });
          console.log(marker.id);
          self.props._updateItemsFromMarker(self.state.items);
        });
        markers.push(marker);
      });
      return markers;
    }
  }

  _convertAdressToCoordinates = (key, adresses) => {
    let locations = [];
    Geocode.setApiKey(key);
    adresses.forEach(adress => {
      Geocode.fromAddress(adress).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          const place_id = response.results[0].place_id;
          let loc = {
            place_id,
            spatial: adress,
            lat,
            lng
          };
          let found = false;
          if (locations.length > 0) {
            locations.forEach(elt => {
              if (elt.place_id === loc.place_id) {
                found = true;
              }
            });
          }
          if (!found) {
            locations.push(loc);
          }
        },
        error => {
          console.error(error);
        }
      );
    });
    return locations;
  }

  _fetchItems = async (adress) => {
    let SETTINGS = await this.props.conf;
    let hypertopic = new Hypertopic(SETTINGS.services);
    return hypertopic.getView(`/user/${SETTINGS.user}`)
      .then(data => {
        let user = data[SETTINGS.user] || {};
        user = {
          corpus: user.corpus || []
        };
        return user;
      })
      .then(x =>
        x.corpus.map(y => `/corpus/${y.id}`)
      )
      .then(hypertopic.getView)
      .then((data) => this._checkSpatial(data, adress));
  }

  _checkSpatial = (data, adress) => {
    let sortedData = [];
    let spatial = adress;
    for (let corpusID in data) {
      let currentCorpus = data[corpusID];
      for (let itemID in currentCorpus) {
        let currentItem = currentCorpus[itemID];
        if (typeof (currentItem) === 'object') {
          currentItem.id = itemID;
          currentItem.corpus = corpusID;
          if (Array.isArray(currentItem.spatial) && currentItem.spatial !== undefined) {
            let currentSpatial = currentItem.spatial[0].toString();
            if (spatial !== null) {
              if (currentSpatial.includes(spatial) && currentSpatial !== undefined) {
                sortedData.push(currentItem);
              }
            } else {
              sortedData.push(currentItem);
            }
          }
        }
      }
    }
    return sortedData;
  }
}

export default GeographicMap;