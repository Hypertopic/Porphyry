import React, {useEffect, useState} from 'react';
import {Trans, t} from '@lingui/macro';

function InputFile ({itemId, propsRev, onUpload, service}) {
  const [rev, setRev] = useState('');
  const [uploadStatus, setUpload] = useState({ isUpload: false, message: '' });

  const postFile = async (file, revision) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', file.type);
    //Request for adding a resource
    return await fetch(await service + itemId + '/' + file.name + '?rev=' + revision,
      { method: 'PUT', body: file, headers: myHeaders, credentials: 'include'})
      .then(res => res.json())
      .catch(() => setUpload({ isUpload: false, message: t`Une erreur est survenue` }));
  };

  useEffect(() => {
    setRev(propsRev);
  }, [propsRev]);
  useEffect(() => {
    onUpload(uploadStatus);
    // eslint-disable-next-line
  }, [uploadStatus]);
  const handleFiles = async (event) => {
    event.preventDefault();
    const files = Array.from(event.target.files);
    let newRev = rev;
    for (let file of files) {
      const result = await postFile(file, newRev);
      newRev = result.rev;
    }
    if (!uploadStatus.message) {
      setUpload({ isUpload: true, message: t`Tous les fichiers ont bien été ajoutés` });
    }
  };

  const handleMessage = () => {
    setUpload({isUpload: false, message: ''});
  };

  return (
    <div>
      <div >
        <button className="inputFiles_Button" onClick={()=>document.getElementById('inputFiles').click() } ><Trans>Ajouter une ressource </Trans></button>
        <input multiple id="inputFiles" type="file" onChange={handleFiles} onClick={handleMessage} />
      </div>
    </div>
  );
}

export default InputFile;
