import React, { Component } from 'react';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import $ from 'jquery'
var hypertopic = require("hypertopic")

class Duplicator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            showModalConfirmation: false,
            showToast: false,
            corpora: [],
            viewpoints: []
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleValidate = this.handleValidate.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
        this.closeToast = this.closeToast.bind(this)
        this.addUserToEntity = this.addUserToEntity.bind(this)
      }

    handleClose() {
        this.setState({ showModal: false, showModalConfirmation: false });
    }

    handleShow() {
        this.setState({ showModal: true });
    }

    handleValidate() {
        if(this.state.viewpoints.length > 0 || this.state.corpora.length > 0) {
            console.log(this.state.viewpoints)
            console.log(this.state.corpora)
            this.nameDuplicatedPortfolio = $('#portfolioDuplicatedName').val()
            this.handleClose();
            this.setState({ showModalConfirmation: true})
        }
    }

    async handleConfirm() {
        this.setState({ showModalConfirmation: false, showToast: true });

        var ids = this.state.viewpoints.concat(this.state.corpora)
        let that = this

        await Promise.all(ids.map(id => that.addUserToEntity(id)))
        //refresh page
        this.setState({showToast: false });
        window.location.replace("http://" + this.nameDuplicatedPortfolio + ".local:3000");

    }

    addUserToEntity(user){
        let db = hypertopic([
            "http://localhost",
            "http://steatite.hypertopic.org"
        ]);

        const _error = (x) => {
            console.error(x.message)
            return x
        };

        return db.get({_id:user})
        .then( (x) => {
            if(!x.users.includes(this.nameDuplicatedPortfolio))
                 x.users.push(this.nameDuplicatedPortfolio)
            return x
        })
        .then(db.post)
        .then((x) => {
            console.log(x)
        })
        .catch(_error);
    }

    closeToast() {
        this.setState(() => {
          return {
            showToast: false
          };
        });
    }
    onChangeCheckBox(e) {
        $('.checkCorpora').each(function() {
            if ($(this).is(":checked")) {
                $('.Corpus').each(function() {
                    $(this).prop('checked', true);
                    $(this).prop('disabled', true);
                });
            }else{
                $('.Corpus').each(function() {
                    $(this).prop('disabled', false);
                });
            }
        });

        $('.checkViewPoints').each(function() {
            if ($(this).is(":checked")) {
                $('.ViewPoint').each(function() {
                    $(this).prop('checked', true);
                    $(this).prop('disabled', true);
                });
            }else{
                $('.ViewPoint').each(function() {
                    $(this).prop('disabled', false);
                });
            }
        });

        var selectedViewPoints = [];
        $('.ViewPoint').each(function() {
            if ($(this).is(":checked")) {
                selectedViewPoints.push($(this).attr('value'));
            }
        });

        var selectedCorpora = [];
        $('.Corpus').each(function() {
            if ($(this).is(":checked")) {
                selectedCorpora.push($(this).attr('value'));
            }
        });

        this.setState({
            corpora: selectedCorpora,
            viewpoints: selectedViewPoints
        })
    }

    render() {
        let name = this.props.userConnected + '-' + this.props.portfolio
        let corpora = this.props.corpora.map((v, i) =>
            <div className='Modal-Group' key={v.id}>
                <input name={v.id} className='Modal-CheckBox Corpus' value={v.id} onChange={this.onChangeCheckBox} type="checkbox"/>
                {v.id}
            </div>
        );

        let viewpoints = this.props.viewpoints.map((v, i) =>
            <div className='Modal-Group' key={v.id}>
                <input name={v.name} className='Modal-CheckBox ViewPoint' value={v.id} onChange={this.onChangeCheckBox} type="checkbox"/>
                {v.name}
            </div>
        );


        return (
            <div>
                <Modal show={this.state.showToast}>
                    <Modal.Body>
                        <h3>Redirection à la nouvelle page...</h3>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showModalConfirmation}>
                    <Modal.Body>
                        <h3>Créer le nouveau portfolio</h3>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={this.handleConfirm}>
                            Confirmer
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showModal}>
                    <Modal.Body>
                        <h3>Nom du portfolio</h3>
                        <input type='text' name="copyName" className='Modal-Input form-control' defaultValue={name} placeholder='Nom du nouveau portfolio' id="portfolioDuplicatedName"/>
                        <div className='Modal-Group Modal-Title'>
                            <h3>Corpus</h3>
                            <div className='Modal-Group'><input className='Modal-CheckBox checkCorpora' type="checkbox" onChange={this.onChangeCheckBox}/>Tout</div>
                        </div>
                        <hr/>
                        <div id="corporaList">
                            {corpora}
                        </div>
                        <br/>
                        <div className='Modal-Group Modal-Title'>
                            <h3>Points de vue</h3>
                            <div className='Modal-Group'><input className='Modal-CheckBox checkViewPoints' name={name} type="checkbox" onChange={this.onChangeCheckBox}/>Tout</div>
                        </div>
                        <hr/>
                        <div id="viewPointsList">
                            {viewpoints}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={this.handleValidate}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Dropdown.Item eventKey="2" onClick={this.handleShow}>Dupliquer</Dropdown.Item>
            </div>

        )
    }
}

export default Duplicator;
