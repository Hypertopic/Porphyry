import React, {useState} from 'react';

function Attachment ({ attachment, itemId, service }) {
  const [url, setUrl] = useState('');
  const setDefaultUrl = () => {
    service.then((service) => {
      setUrl(service);
    });
  };
  setDefaultUrl();
  return (
    <div>
      <li className="item_attachment">
        <a href={url + itemId + '/' + attachment.name} target="_blank" rel="noreferrer">
          {attachment.name}
        </a>
      </li>
    </div>
  );
}

export default Attachment;
