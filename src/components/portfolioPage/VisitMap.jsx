import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class VisitMap extends Component {

  render() {
    let { items, map } = this.props;
    let window_items = Object.values(
      items
        .filter(x =>
          !!x.thumbnail
          && /^[A-Z]+ \d{3}$/.test(x.name[0])
        )
        .reduce((result, x) => {
          let key = x.name[0];
          if (!result[key] || (x.plan && x.plan[0] === 'large')) {
            result[key] = x;
          }
          return result;
        }, {})
    );
    let two_dimensional_locations = window_items.map(x => x.name[0].match(/\d{3}/)[0])
      .map(x => ({
        elevation: Math.floor(x / 100),
        position: x % 100,
      }));
    let nbFloors = Math.max(...two_dimensional_locations.map(x => x.elevation)) + 1;
    let nbCols = 2 * nbFloors + 1;
    let nbPositions = Math.max(...two_dimensional_locations.map(x => x.position));
    let nbRows = Math.ceil(nbPositions / 2) + nbFloors;
    let located_items = window_items
      .map((item, i) => {
        let {elevation, position} = two_dimensional_locations[i];
        let sign = 1 - 2 * (position % 2);
        let x = (position === 0)
          ? nbFloors
          : nbFloors + sign * (nbFloors - elevation);
        let y = (position === 0)
          ? elevation
          : nbFloors + Math.floor((position - 1) / 2);
        return { ...item, coordinates: { x, y } };
      });
    return (<div className="col-md-8 p-4">
      <div className="Subject">
        <h2 className="h4 font-weight-bold text-center">{located_items.length === 0 ? 'Chargement en cours' : 'Carte'}</h2>
        <div className="m-4" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${nbFloors}, minmax(50px, 1fr)) minmax(100px, 2fr) repeat(${nbFloors}, minmax(50px, 1fr))`,
          gridTemplateRows: `repeat(${nbRows + 1}, auto)`,
          gridGap: '1rem',
          overflowX: 'auto'
        }}>{
            new Array(Math.max(nbFloors - 1, 0)).fill(0).map((_, index) => <React.Fragment key={'column' + index}>
              <div style={{
                gridRow: '1 / 2',
                gridColumn: `${index + 2} / ${index + 3}`
              }}>{index === 0 ? <>1<sup>er</sup></> : <>{index + 1}<sup>ème</sup></>} étage</div>
              <div style={{
                gridRow: '1 / 2',
                gridColumn: `${nbCols - index - 1} / ${nbCols - index}`
              }}>{index === 0 ? <>1<sup>er</sup></> : <>{index + 1}<sup>ème</sup></>} étage</div>
            </React.Fragment>)
          }
          <div style={{
            gridRow: '1 / 2',
            gridColumn: `${nbFloors + 1} / ${nbFloors + 2}`
          }}>
            Allée centrale
          </div>
          {
            located_items.map(x => <Item key={x.id} data={x} />)
          }
          {
            map && <Link id="plan" to={{
              pathname: `/item/${map.corpus}/${map.id}`,
              search: `?visit=${map.spatial[0]}`
            }} style={{
              gridColumn: `${nbFloors + 1} / ${nbFloors + 2}`,
              gridRow: `${nbFloors + 2} / ${nbRows + 3}`,
              margin: 'auto'
            }}>
              <img src={map.resource[0]} alt={map.name[0]}/>
            </Link>
          }
        </div>
      </div>
    </div>);
  }
}

class Item extends Component {

  render() {
    let {coordinates, corpus, id, spatial, thumbnail, name} = this.props.data;
    return (
      <div className="Item" style={{
        gridColumn: `${coordinates.x + 1} / ${coordinates.x + 2}`,
        gridRow: `${coordinates.y + 2} / ${coordinates.y + 3}`,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Link to={{
          pathname: `/item/${corpus}/${id}`,
          search: `?visit=${spatial && spatial[0]}`
        }} >
          <img src={thumbnail[0]} alt={name[0]} style={{
            margin: 'auto'
          }} />
        </Link>
      </div>
    );
  }

}

export default VisitMap;
