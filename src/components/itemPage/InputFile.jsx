import React, {useEffect, useState} from 'react';
// import Hypertopic from 'hypertopic';

function InputFile ({itemId, propsRev, onUpload, service}) {
  const [rev, setRev] = useState('');
  const [uploadStatus, setUpload] = useState({ isUpload: false, message: '' });

  // Post one file
  const postFile = async (file, revision) => {
    // Gestion des headers pour la requête
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', file.type);
    myHeaders.append('credentials', 'include');
    myHeaders.append('Authorization', 'Basic ' + Buffer.from('alice:whiterabbit').toString('base64'));
    //Requête permettant d'ajouter une ressource à l'item correspondant
    return await fetch(await service + itemId + '/' + file.name + '?rev=' + revision,
      { method: 'PUT', body: file, headers: myHeaders})
      .then(res => res.json())
      .catch(() => setUpload({ isUpload: false, message: 'Une erreur est survenue' }));
  };

  useEffect(() => {
    setRev(propsRev);
  }, [propsRev]);
  useEffect(() => {
    console.log('changed : ', uploadStatus);
    onUpload(uploadStatus);
    // eslint-disable-next-line
  }, [uploadStatus]);
  const handleFiles = async (event) => {
    event.preventDefault();
    setUpload({isUpload: false, message: ''});
    const files = Array.from(event.target.files);
    let newRev = rev;
    for (const file of files) {
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', file.type);
      myHeaders.append('credentials', 'include');
      myHeaders.append('Authorization', 'Basic ' + Buffer.from('alice:whiterabbit').toString('base64'));
      const result = await postFile(file, newRev);
      newRev = result.rev;
      console.log('Fichier upload: ', file.name, ' ', file.type);
    }
    console.log('upload statuts : ', uploadStatus);
    if (!uploadStatus.message) {
      setUpload({ isUpload: true, message: 'Tous les fichiers ont bien été ajoutés' });
    }
  };

  return (
    <div>
      <div className="custom-file">
        <input multiple type="file" className="custom-file-input" id="inputFiles" onChange={handleFiles} />
        <label className="custom-file-label" htmlFor="inputFiles">Sélectionner des fichiers</label>
      </div>
    </div>
  );
}

export default InputFile;
