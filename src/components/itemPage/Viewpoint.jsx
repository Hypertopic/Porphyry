import React from 'react';
import Hypertopic from 'hypertopic';
import conf from '../../config.js';
import {Topics} from '../../model.js';
import TopicPath from './TopicPath.jsx';
import TopicTree from '../../TopicTree.js';
import InputWithSuggestions from '../InputWithSuggestions.jsx';
import { t } from '@lingui/macro';
import { i18n } from "../../index.js"

class Viewpoint extends React.Component {
  constructor(props) {
    super();
    this.state = {
      topics: {},
      topicInputvalue: '',
      currentSelection: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.update_seq !== prevProps.update_seq) {
      this._fetchViewpoint();
    }
  }

  onTopicInputFocus = (event) => {
    if (this.blurTimeout) {
      this.blurTimeout=clearTimeout(this.blurTimeout);
    }
    this.setState({hasFocus:true});
  }

  onTopicInputBlur = (event) => {
    this.blurTimeout=setTimeout(() => {
      this.setState({hasFocus:false});
    },200);
  }

  onTopicInputkeyDown = (event) => {
    if (event.key==="Escape") {
      this.clearInput();
    }
  };

  onTopicInputChange = (event, { newValue }) => {
    if (this.state.currentSelection) {
      newValue="";
    }
    this.setState({
      topicInputvalue: newValue,
      currentSelection:""
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({ currentSelection: suggestion });
  };

  clearInput = () => {
    this.setState({
      topicInputvalue: '',
      currentSelection: '',
      newTopic:""
    });
  };

  updatingTopicList = (topicToAssign, viewpointId) => {
    return this.props
      .assignTopic(topicToAssign, viewpointId)
      .catch(error => console.error(error));
  };

  render() {
    const paths = this._getPaths();
    const inputProps = {
      placeholder: this.state.newTopic ? i18n._(t`Choisir une rubrique parent...`) : i18n._(t`Ajouter une rubrique...`),
      value: this.state.topicInputvalue,
      onFocus: this.onTopicInputFocus,
      onBlur: this.onTopicInputBlur,
      onChange: this.onTopicInputChange,
      onKeyDown: this.onTopicInputKeyDown,
    };
    var classes=["TopicAdding","input-group"];
    if (!this.state.hasFocus) {
      classes.push("inactive");
    }
    var newTopic;
    if (this.state.newTopic) {
      newTopic=<div className="newTopic">Ajouter nouveau : &gt; {this.state.newTopic}
      <button type="button" className="btn btn-xs ml-3 float-right DeleteButton"
        onClick={_ => this.setState({newTopic:""})} id="deleteButton-newTopic">
        <span className="oi oi-x"> </span>
      </button></div>;
    }
    const canValidateTopic=this.state.currentSelection || this.state.newTopic || this.state.topicInputvalue.length > 2;
    let alreadyAssigned = this.props.topics.map(x => x.id);
    let candidates = new Topics(this.state.topics).getAllPaths()
      .filter(x => !alreadyAssigned.includes(x.id));
    return (
      <div className="Viewpoint">
        <h3 className="h4">{this.state.name}</h3>
        <hr/>
        <div className="Topics">
          {paths}
          <div className={classes.join(" ")}>
            <InputWithSuggestions candidates={candidates}
              onSuggestionSelected={this.onSuggestionSelected}
              inputProps={inputProps}
              id={this.props.id}
            />
            <div className="input-group-append">
              <button type="button" className="btn btn-sm ValidateButton btn" onClick={() => {
                  if (this.state.newTopic && (this.state.currentSelection || !this.state.topicInputvalue)) {
                    var parentId;
                    if (this.state.currentSelection) parentId=this.state.currentSelection.id
                    this.createTopic(this.state.newTopic,parentId)
                      .then(newId => {
                        this.updatingTopicList(
                          newId,
                          this.props.id
                        )
                      })
                      .then(this.clearInput);
                  } else {
                    if (this.state.currentSelection) {
                      this.updatingTopicList(
                        this.state.currentSelection.id,
                        this.props.id
                      ).then(this.clearInput);
                    } else {
                      this.setState({
                        newTopic:this.state.topicInputvalue,
                        topicInputvalue:""
                      });
                    }
                  }
                }}
                onFocus={this.onTopicInputFocus} onBlur={this.onTopicInputBlur}
                disabled={!canValidateTopic}
                id={`validateButton-${this.state.name}`}>
                <span className="oi oi-check"> </span>
              </button>
            </div>
            {newTopic}
          </div>
        </div>
      </div>
    );
  }

  _getPaths() {
    return this.props.topics.map(t => (
      <TopicPath
        key={t.id}
        id={t.id}
        topics={this.state.topics}
        removeTopic={() => this.props.removeTopic(t)}
      />
    ));
  }

  componentDidMount() {
    this._fetchViewpoint();
  }

  async _fetchViewpoint() {
    let hypertopic = new Hypertopic((await conf).services);
    return hypertopic.getView(`/viewpoint/${this.props.id}`).then((data) => {
      let viewpoint = data[this.props.id];
      let name = viewpoint.name;
      let topics = viewpoint;
      delete topics.user;
      delete topics.name;
      delete topics.upper;
      this.setState({name, topics});
    });
  }

  async createTopic(name,parent) {
    var newId;
    let hypertopic = new Hypertopic((await conf).services);
    return hypertopic.get({ _id: this.props.id })
      .then(x => {
        var topicTree=new TopicTree(x.topics);
        var newParent=parent || 'root';
        var newTopic=topicTree.newChildren(newParent);
        newTopic.name=name;
        newId=newTopic.id;
        delete newTopic.id;
        x.topics=topicTree.topics;
        return x;
      })
      .then(hypertopic.post)
      .then(_ => {
        this.setState(previousState => {
          let newTopic={
            id:newId,
            name:[name]
          };
          if (parent) {
            newTopic.broader=[{
              id:parent,
              name:previousState.topics[parent].name
            }];
          }
          previousState.topics[newId]=newTopic;
          return previousState;
        })
      })
      .then(_ => {return newId});
  }

}

export default Viewpoint;
