import React, { Component } from 'react';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';

const RssIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 448 448" xmlSpace="preserve" >
    <g>
      <g>
        <circle cx="64" cy="384" r="64" fill="#ffffff"/>
      </g>
    </g>
    <g>
      <g>
        <path fill="#ffffff" d="M0,149.344v85.344c117.632,0,213.344,95.68,213.344,213.312h85.312C298.656,283.328,164.672,149.344,0,149.344z"/>
      </g>
    </g>
    <g>
      <g>
        <path fill="#ffffff" d="M0,0v85.344C200,85.344,362.688,248,362.688,448H448C448,200.96,247.04,0,0,0z"/>
      </g>
    </g>
  </svg>
);

class Rss extends Component {

  constructor(props) {
    super(props);
    this.state = {rss: ''};
  }

  render() {
    return (
      <div className="rss-btn">
        <Link to="/rss">
          <div className="rss-icon">
            <RssIcon/>
          </div>
          <Trans>Flux RSS</Trans>
        </Link>
      </div>
    );
  }

}

export default Rss;