import {useEffect, useState} from 'react';
import Attachment from './Attachment';
import InputFile from './InputFile';
import conf from '../../config';
import {useParams} from 'react-router-dom';

function AttachmentsList () {
  const [attachments, setAttachments] = useState([]);
  const [rev, setRev] = useState('');
  const [message, setMessage] = useState('');
  const { item } = useParams();
  const getService = async () => {
    return (await conf).services[0] + '/';
  };
  const fetchGet = async (itemId) => {
    await fetch(await getService() + itemId)
      .then(res => res.json())
      .then(async res => {
        const array = [];
        await setRev(res._rev);
        if (res._attachments) {
          Object.keys(res._attachments).forEach((resourceObj) => {
            array.push({name: resourceObj, ...res._attachments[resourceObj]});
            setAttachments(array);
          });
        } else {
          setAttachments([]);
        }
      });
  };
  useEffect(() => {
    async function fetchData(itemId) {
      await fetchGet(itemId);
    }
    fetchData(item);
    // eslint-disable-next-line
  }, [item]);
  const uploadFetch = async (uploadStatus) => {
    if (uploadStatus.isUpload) {
      await fetchGet(item);
    }
    setMessage(uploadStatus.message);
  };
  return (
    <div className="attachment_list_input">
      <ul className="attachment_list">
        {attachments.map((x) => <Attachment key={x.name} attachment={x} itemId={item} service={getService()} />)}
      </ul>
      <InputFile itemId={item} propsRev={rev} onUpload={uploadFetch} service={getService()}/>
      <span className="mt-2">{message}</span>
    </div>
  );
}

export default AttachmentsList;
