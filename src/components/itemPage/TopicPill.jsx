import React from 'react';
import { Link } from 'react-router-dom';
import Selection from '../../Selection.js';

const TopicPill = ({ id, name }) => {
  let uri = `../..${ (new Selection(id)).toURI() }`;
  return (
    <div className="TopicPill">
      <Link title={id} key={id} to={uri}>{name ?? ''}</Link>
    </div>
  );
};

export default TopicPill;
