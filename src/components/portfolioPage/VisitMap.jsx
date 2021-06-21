import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class VisitMap extends Component {

  _getItemCoordinates(input, nbFloors) {
    const y = input % 100 === 0 ? Math.floor(input / 100) : nbFloors + Math.floor((input % 100 - 1) / 2);
    const sign = 1 - 2 * (input % 2);
    const x = input % 100 === 0 ? nbFloors : nbFloors + sign * (nbFloors - Math.floor(input / 100));
    return {
      x,
      y
    };
  }

  render() {
    let { items } = this.props;
    const inputs = items
      .filter(item => /^[A-Z]+ ?\d*$/.test(item.name[0]))
      .reduce((acc, item) => {
        const results = item.name[0].match(/\d{3}$/);
        if (results) {
          acc.push({
            item,
            input: parseInt(results[0], 10)
          });
        }
        return acc;
      }, []);
    const nbFloors = inputs.length ? Math.ceil(Math.max(...inputs.map(elt => elt.input)) / 100) : 0;
    let selectedItems = inputs.map(elt => {
      return {
        ...(elt.item),
        coordinates: this._getItemCoordinates(elt.input, nbFloors)
      };
    });
    selectedItems = selectedItems
      .map(x => x.name[0])
      .map((x, i, arr) => arr.indexOf(x) === i && i)
      .filter(x => selectedItems[x])
      .map(x => selectedItems[x]);
    const nbCols = 2 * nbFloors + 1;
    const nbRows = inputs.length ? Math.max(...selectedItems.map(x => x.coordinates.y)) + 1 : 0;
    const map = items.find(x => /^[A-Z]+$/.test(x.name[0]));
    return (<div className="col-md-8 p-4">
      <div className="Subject">
        <h2 className="h4 font-weight-bold text-center">{selectedItems.length === 0 ? 'Chargement en cours' : 'Carte'}</h2>
        <div className="m-4" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${nbFloors}, minmax(50px, 1fr)) minmax(100px, 2fr) repeat(${nbFloors}, minmax(50px, 1fr))`,
          gridTemplateRows: `repeat(${nbRows + 1}, auto)`,
          gridGap: '1rem',
          overflowX: 'auto'
        }}>{
            new Array(Math.max(nbFloors - 1, 0)).fill(0).map((_, index) => <>
              <div style={{
                gridRow: '1 / 2',
                gridColumn: `${index + 2} / ${index + 3}`
              }}>{index === 0 ? <>1<sup>er</sup></> : <>{index + 1}<sup>ème</sup></>} étage</div>
              <div style={{
                gridRow: '1 / 2',
                gridColumn: `${nbCols - index - 1} / ${nbCols - index}`
              }}>{index === 0 ? <>1<sup>er</sup></> : <>{index + 1}<sup>ème</sup></>} étage</div>
            </>)
          }
          <div style={{
            gridRow: '1 / 2',
            gridColumn: `${nbFloors + 1} / ${nbFloors + 2}`
          }}>
            Allée centrale
          </div>
          {
            selectedItems.map(item => <div style={{
              gridColumn: `${item.coordinates.x + 1} / ${item.coordinates.x + 2}`,
              gridRow: `${item.coordinates.y + 2} / ${item.coordinates.y + 3}`,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Link to={{
                pathname: `/item/${item.corpus}/${item.id}`,
                search: `?visit=${item.spatial[0]}`
              }} >
                <img src={item.thumbnail[0]} alt={item.name[0]} style={{
                  margin: 'auto'
                }} />
              </Link>
            </div>)
          }
          {
            map && <Link to={{
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

export default VisitMap;