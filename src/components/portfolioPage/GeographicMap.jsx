import React from 'react';
import {Items} from '../../model.js';

class GeographicMap extends React.Component {

  state = {
    places: []
  }

  componentDidUpdate(prevProps) {
    if (this.props.items !== prevProps.items) {
      this.props.conf.then((conf) => {
        if (conf.map) {
          let places = new Items(this.props.items).getAttributeValues('spatial');
          let api_key = conf.map;
          this.setState({places, api_key});
        }
      });
    }
  }

  render() {
    if (!this.state.places.length) return null;
    let alt = this.state.places.join(';');
    let markers = this.state.places
      .splice(0, 15)
      .join('|');
    return (
      <img alt={alt}
        src={`https://maps.googleapis.com/maps/api/staticmap?size=640x480&markers=${markers}&key=${this.state.api_key}`}
      />
    );
  }

}

export default GeographicMap;
