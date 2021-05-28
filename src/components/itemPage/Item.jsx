import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hypertopic from 'hypertopic';
import groupBy from 'json-groupby';
import conf from '../../config.js';
import Viewpoint from './Viewpoint.jsx';
import Attribute from './Attribute.jsx';
import Resource from './Resource.jsx';
import Header from '../Header.jsx';
import SameNameBlock from './SameNameBlock.jsx';
import { DiscussionEmbed } from 'disqus-react';
import { t, Trans } from '@lingui/macro';
import { i18n } from '../../index.js';

const HIDDEN = ['topic', 'resource', 'thumbnail', 'item'];

function getString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(val => getString(val)).join(', ');
  }
  return String(obj);
}

class Item extends Component {

  constructor() {
    super();
    this.state = {
      attributeInputValue: '',
      item: {topic: []}
    };
  }

  render() {
    let name = getString(this.state.item.name);
    let attributes = this._getAttributes();
    let viewpoints = this._getViewpoints();
    let sameNameBlock = this._getSameNameBlock();
    return (
      <div className="App container-fluid">
        <Header conf={conf} />
        <div className="Status row h5">
          <Link to="/" className="badge badge-pill badge-light TopicTag">
            <span className="badge badge-pill badge-dark oi oi-chevron-left"> </span>
            <Trans>Retour à l'accueil</Trans>
          </Link>
        </div>
        <div className="container-fluid">
          <div className="App-content row">
            <div className="col-md-4 p-4">
              <div className="DescriptionA">
                <h2 className="h4 font-weight-bold text-center"><Trans>Description</Trans></h2>
                <div className="p-3">
                  <div className="Attributes">
                    <h3 className="h4"><Trans>Attributs du document</Trans></h3>
                    <hr/>
                    <div>
                      {attributes}
                    </div>
                    <div className="d-none d-sm-block">{this._getAttributeCreationForm()}</div>
                  </div>
                  {viewpoints}
                </div>
              </div>
              <hr className="space" />
              {sameNameBlock}
            </div>
            <div className="col-md-8 p-4">
              <div className="Subject">
                <h2 className="h4 font-weight-bold text-center">{name}</h2>
                <Resource href={this.state.item.resource} />
              </div>
              <Comments appId={this.state.disqus} item={this.state.item} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  _getAttributes() {
    return Object.entries(this.state.item)
      .filter(x => !HIDDEN.includes(x[0]))
      .map(x => (
        <Attribute key={x[0]} name={x[0]} value={x[1][0]}
          setAttribute={this._setAttribute} deleteAttribute={this._deleteAttribute}/>
      ));
  }

  _getViewpoints() {
    return Object.entries(this.state.item.topic).map(v =>
      <Viewpoint key={v[0]} id={v[0]} topics={v[1]}
        assignTopic={this._assignTopic} removeTopic={this._removeTopic} update_seq={this.state.update_seq} />
    );
  }

  _getSameNameBlock() {
    //before returning the SameNameBlock Component, we ensure that the consulted item name value is defined
    if (this.state.item.name !== undefined && this.state.item.name !== null) {
      return (
        <SameNameBlock ID={this.props.match.params.item} itemName={this.state.item.name} />
      );
    }
    //item name has no value
  }

  _fetch_update_seq = async () => {
    let SERVICE = (await conf).services[0];
    return fetch(SERVICE)
      .then(response => response.json())
      .then(data => {
        this.setState({update_seq: data.update_seq});
      });
  }

  initEventSource = async () => {
    let SERVICE = (await conf).services[0];
    return this._fetch_update_seq().then(() => {
      let params = this.props.match.params;
      let viewpoints = Object.keys(this.state.item.topic).join(',');
      this.eventSource = new EventSource(`${SERVICE}/events?since=${this.state.update_seq}&corpus=${params.corpus}&viewpoint=${viewpoints}`);
    });
  }

  componentDidMount() {
    if (!this.eventSource) {
      this._fetch_update_seq();
      let self = this;
      this._fetchItem().then(() => {
        this.initEventSource().then(() => {
          if (self.eventSource) {
            this.eventSource.onmessage = e => {
              let data = JSON.parse(e.data);
              if (this.state.update_seq !== data.seq) {
                this.setState({ update_seq: data.seq });
                if (this.props.match.params.item === data.id) {
                  this._fetchItem();
                }
              }
            };
          } else {
            console.error('eventSource is undefined, updates are impossible');
          }
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  _fetchItem = async () => {
    let uri = this.props.match.url;
    let params = this.props.match.params;
    let SETTINGS = await conf;
    this.setState({disqus: SETTINGS.disqus});
    let hypertopic = new Hypertopic(SETTINGS.services);
    return hypertopic.getView(uri).then((data) => {
      let item = data[params.corpus][params.item];
      let itemTopics = (item.topic) ? groupBy(item.topic, ['viewpoint']) : {};
      let topics = this.state.item.topic || {};
      topics = (itemTopics.length > 0) ? topics : {};
      for (let id in itemTopics) {
        topics[id] = itemTopics[id];
      }
      item.topic = topics;
      this.setState({item});
    }).catch(e => console.error(e.message))
      .then(() => hypertopic.getView(`/user/${SETTINGS.user}`))
      .then((data) => {
        let user = data[SETTINGS.user] || {};
        if (user.viewpoint) {
          let topic = this.state.item.topic;
          for (let vp of user.viewpoint) {
            topic[vp.id] = topic[vp.id] || [];
          }
          this.setState({topic});
        }
      });
  };

  _parseAttributeInput() {
    return (this.state.attributeInputValue.match(/([^:]*):(.*)/) || [])
      .splice(1)
      .map(t => t.trim());
  }

  _getAttributeCreationForm() {
    let classes = ['AttributeForm', 'input-group'];

    let attributeInputChange = (e) => {
      this.setState({ attributeInputValue: e.target.value });
    };

    let attributeInputChangeKeyDown = (e) => {
      if (e.key === 'Escape') {
        this.setState({ attributeInputValue: '' });
      }
    };

    let attributeInputFocus = (e) => {
      if (this.blurTimeout) {
        this.blurTimeout = clearTimeout(this.blurTimeout);
      }
      this.setState({ attributeInputFocus: true });
    };

    let attributeInputBlur = (e) => {
      this.blurTimeout = setTimeout(() => {
        this.setState({ attributeInputFocus: false });
      }, 200);
    };

    let valid = false;

    if (!this.state.attributeInputFocus) {
      classes.push('inactive');
    } else {
      let [key, value] = this._parseAttributeInput();
      if (key && value) {
        valid = true;
        if (this.state.item[key]) {
          classes.push('modify');
        }
      }
    }

    let placeholder = t`Ajouter un attribut et une valeur...`;
    if (this.state.attributeInputFocus) {
      placeholder = t`attribut : valeur`;
    }

    return (
      <form onSubmit={this._submitAttribute} className={classes.join(' ')}>
        <div className="attributeInput">
          <input ref={(input) => this.attributeInput = input} value={this.state.attributeInputValue}
            onChange={attributeInputChange} onKeyDown={attributeInputChangeKeyDown}
            onFocus={attributeInputFocus} onBlur={attributeInputBlur}
            id="new-attribute" className="form-control" placeholder={i18n._(placeholder)} type="text" />
        </div>
        <div className="input-group-append">
          <button type="button" className="btn btn-sm ValidateButton btn"
            onClick={this._submitAttribute}
            onFocus={attributeInputFocus} onBlur={attributeInputBlur}
            disabled={!valid}
            id={`validateButton-${this.state.name}`}>
            <span className="oi oi-check"> </span>
          </button>
        </div>
      </form>
    );
  }

  _setAttribute = async (key, value) => {
    if (key !== '' && value !== '') {
      return new Hypertopic((await conf).services)
        .item({
          _id: this.props.match.params.item,
          item_corpus: this.props.match.params.corpus
        })
        .setAttributes({[key]: [value]})
        .then(_ => this.setState(previousState => {
          previousState.item[key] = [value];
          return previousState;
        }))
        .catch((x) => console.error(x.message));
    }
    console.error('Créez un attribut non vide');
    return new Promise().fail();
  }

  _submitAttribute = (e) => {
    e.preventDefault();
    let [key, value] = this._parseAttributeInput();
    if (!key || !value) return false;
    this._setAttribute(key, value);
    this.setState({ attributeInputValue: '' });
    this.attributeInput.focus();
    return false;
  };

  _deleteAttribute = async (key) => {
    const _error = (x) => console.error(x.message);
    new Hypertopic((await conf).services)
      .item({
        _id: this.props.match.params.item,
        item_corpus: this.props.match.params.corpus
      })
      .unsetAttribute(key)
      .then(_ => {
        this.setState(previousState => {
          delete previousState.item[key];
          return { item: previousState.item };
        });
      })
      .catch(_error);
  };

  _assignTopic = async (topicToAssign, viewpointId) => {
    return new Hypertopic((await conf).services)
      .item({
        _id: this.props.match.params.item,
        item_corpus: this.props.match.params.corpus
      })
      .setTopic(topicToAssign, viewpointId)
      .then(data => {
        this.setState(newState => {
          newState.topic[viewpointId].push({
            viewpoint: viewpointId,
            id: topicToAssign
          });
          return newState;
        });
      })
      .catch(error => console.error(error));
  };

  _removeTopic = async (topicToDelete) => {
    if (window.confirm(i18n._(t`Voulez-vous réellement que l'item affiché ne soit plus décrit à l'aide de cette rubrique ?`))) {
      return new Hypertopic((await conf).services)
        .item({
          _id: this.props.match.params.item,
          item_corpus: this.props.match.params.corpus
        })
        .unsetTopic(topicToDelete.id)
        .then((res)=> {
          let newState = this.state;
          newState.topic[topicToDelete.viewpoint] = newState.topic[
            topicToDelete.viewpoint
          ].filter(stateTopic => topicToDelete.id !== stateTopic.id);
          this.setState(newState);
        })
        .catch(error => console.error(error));
    }
  };
}

const Comments = React.memo((props) => {
  let config = {
    identifier: props.item.id,
    title: props.item.name
  };
  return (props.appId)
    ? <DiscussionEmbed config={config} shortname={props.appId} />
    : null;
});

export default Item;
