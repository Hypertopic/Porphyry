import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import getConfig from '../../config/config.js';
import Hypertopic from 'hypertopic';
import conf from '../../config/config.json';


let hypertopic = new Hypertopic(conf.services);

// Get the configured list display mode
let listView = getConfig('listView', {
  mode: 'picture',
  name: 'name',
  image: 'thumbnail'
});

class Corpora extends Component {
  
  constructor(props) {
	super(props);
	this.state = {
	  selectMode: false,
	  selectedItems: {},
	  suggestions: [],
	  topics: [],
	  topicInputValue: '',
	  topicSelected: null,
	  confirm: false,
	  addInProgress: false,
	  addCompleted: false
	};
  }

  render() {
    let items = this._getItems();
    let count = this.props.items.length;
    let total = this.props.from;
	
	// For the Autosuggest
	const inputProps = {
		placeholder: "Ajouter une rubrique...",
		value: this.state.topicInputValue,
		onChange: this.topicInputOnChange.bind(this),
		type: "text",
		className: "form-control TopicGroupAddInput"
	}
    const suggestTheme = {
      container: 'autosuggest',
      input: 'form-control',
      suggestionsContainer: 'dropdown open',
      suggestionsList: `dropdown-menu ${this.state.suggestions.length ? 'show' : ''}`,
      suggestion: 'dropdown-item',
      suggestionHighlighted: 'active'
    };
	
	let numberOfSelectedItems = Object.values(this.state.selectedItems).reduce((total, currentValue) => { return currentValue ? total + 1 : total }, 0);
	
	let subjectH2;
	if (this.state.selectMode) {
	  subjectH2 = (
	    <h2 className="h4 font-weight-bold text-center row">
		  <span>Mode sélection</span>
		  <div className="input-group mr-2">
			<Autosuggest className="TopicSuggest"
			  suggestions={this.state.suggestions}
			  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
			  onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
			  onSuggestionSelected={this.onSuggestionSelected.bind(this)}
			  getSuggestionValue={this.getSuggestionValue.bind(this)}
			  renderSuggestion={this.renderSuggestion.bind(this)}
			  inputProps={inputProps}
			  theme={suggestTheme} />
		    <div className="input-group-append">
			  <button className="btn btn-success TopicGroupAddButton" disabled={this.state.topicSelected === null || numberOfSelectedItems === 0} onClick={_ => this.setState({ confirm: true })}><i className="oi oi-check" /></button>
			</div>
		  </div>
		  <div>
		    <button className="btn btn-danger" onClick={_ => this._setSelectMode(false)}>Annuler</button>
		  </div>
		</h2>
	  );
	} else {
	  subjectH2 = (
	    <h2 className="h4 font-weight-bold text-center row">
          <span className="col col-md-auto">{this.props.ids.join(' + ')}</span>
          <div className="col col-md">
		    <span className="badge badge-pill badge-light">{count} / {total}</span>
		  </div>
		  <div className="col col-md"><button className="btn btn-light" onClick={_ => this._setSelectMode(true)}>Attribuer	Topic</button></div>
        </h2>
	  );
	}
	
	let confirm = "";
	if (this.state.confirm && this.state.topicSelected !== null) {
	  let confirmButton = (<button disabled={this.state.addInProgress} className="btn btn-success mr-2" onClick={_ => this._assignTopic()}>Confirmer</button>);
	  confirm = (
	    <div className="TopicGroupAddConfirm text-center">
		  <div>
		    <h3>Ajout du topic &quot;{this.state.topicSelected.topicName}&quot; à la sélection</h3>
			<div>{this.state.addInProgress ? "Ajout en cours..." : (this.state.addCompleted ? "Ajout des topics completé!" : `${numberOfSelectedItems} items sélectionnés`)}</div>
			<div>
			  {this.state.addCompleted ? "" : confirmButton}
			  <button disabled={this.state.addInProgress} className={"btn " + (this.state.addCompleted ? "btn-info" : "btn-danger")} onClick={_ => this.setState({ confirm: false, addCompleted: false })}>{this.state.addCompleted ? "Fermer" : "Annuler"}</button>
			</div>
		  </div>
		</div>
	  );
	}
	
    return(
      <div className="col-md-8 p-4">
		{confirm}
        <div className={"Subject" + (this.state.selectMode ? " selectMode" : "")}>
		  {subjectH2}
          <div className="Items m-3">
            {items}
          </div>
        </div>
      </div>
    );
  }

  _getItems() {
    return this.props.items.map(item =>
        <Item corpora={this} key={item.id} item={item}
          id={item.corpus+'/'+item.id} />
    );
  }
  
  _toggleItemState(item) {
	let temp = this.state.selectedItems;
	temp[item.id] = !temp[item.id];
	this.setState({ selectedItems: temp });
  }
  
  _setSelectMode(activate) {
	if (activate) {
		this.setState({selectMode: true, topics: this._getTopics()});
	} else {
		this.setState({selectMode: false});
	}
  }
  
  _getTopics() {
	  let r = [];
	  for (let viewpoint of this.props.viewpoints) {
		for (let t in viewpoint) {
		  let topic = viewpoint[t];
		  if (typeof topic === "object" && Object.hasOwnProperty.call(topic, "name")) {
		    let parentTopicNames = "";
			let broaderTopic = topic.broader;
			while (broaderTopic) {
			  parentTopicNames = broaderTopic[0].name + " > " + parentTopicNames;
			  broaderTopic = viewpoint[broaderTopic[0].id].broader;
			}
			parentTopicNames = viewpoint.name + " > " + parentTopicNames;
			parentTopicNames = parentTopicNames.substring(0, parentTopicNames.length - 3);
			r.push({
			  topicName: topic.name[0],
			  parentTopicNames,
			  id: t,
			  viewpointId : viewpoint.id
			});
		  }
		}
	  }
	  return r;
  }

  _assignTopic() {
	this.setState({ addInProgress: true });
	let selectedTopic = this.state.topicSelected;
	let items = getSelectedItemsArray(this.state.selectedItems);
	items.forEach(itemId => {
		hypertopic.get({_id: itemId}).then(data => {
			data.topics=data.topics || {};
			data.topics[selectedTopic.id] = { viewpoint: selectedTopic.viewpointId };
			return data;
		  })
		  .then(hypertopic.post)
		  .then(() => {
			  this.setState({ addInProgress: false, addCompleted: true });
		  })
		  .catch(error => {
			  console.log(`error : ${error}`);
			  this.setState({ addInProgress: false });
		  });
	});
  }
  /*-------------*
   | Autosuggest |
   *-------------*/
  
  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	const inputLength = inputValue.length;
	const regex = new RegExp(`(^|\\b)${inputValue}`, 'i');
	if (inputLength !== 0) {
	  let count = 0;
	  return this.state.topics.filter(v => {
		// Normalise the value: remove the accents
		let noAccents = v.topicName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	    return regex.test(noAccents) && count++ < 10;
	  });
	}
	return [];
  }
  
  // Fetches current suggestions and stores them in the state
  onSuggestionsFetchRequested({value}) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Clears the suggestion list
  onSuggestionsClearRequested() {
    this.setState({
		suggestions: []
	});
  };
  
  // A suggestion has been selected from the list of suggestions
  onSuggestionSelected(event, { suggestion }) {
	  this.setState({ topicSelected: suggestion });
  }
  
  // Renders a suggestion item in the suggestions list
  renderSuggestion(suggestion, {query}) {
	query = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	const regex = new RegExp(`(^|\\b)${query}`, 'gi');
	/*let topicNameParts = suggestion.topicName.split(regex).map((t, i) => {
		if (t.toLowerCase() === query.toLowerCase()) {
		  return <b key={i}>{t}</b>;
		}
		return <span key={i}>{t}</span>;
	});*/
	const noAccents = suggestion.topicName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	const regexIndexOf = function(startpos) {
      var indexOf = noAccents.substring(startpos || 0).search(regex);
      return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
	let topicNameParts = [];
	let currentIndex = 0;
	let foundIndex = 0;
	let key = 0;
	while ((foundIndex = regexIndexOf(currentIndex)) !== -1) {
		const nonEmphasized = suggestion.topicName.substring(currentIndex, foundIndex);
		if (nonEmphasized.length > 0) { topicNameParts.push(<span key={key++}>{nonEmphasized}</span>); }
		const emphasized = suggestion.topicName.substring(foundIndex, foundIndex + query.length);
		topicNameParts.push(<b key={key++}>{emphasized}</b>);
		currentIndex = foundIndex + query.length;
	}
	const nonEmphasized = suggestion.topicName.substring(currentIndex);
	if (nonEmphasized.length > 0) { topicNameParts.push(<span key={key++}>{nonEmphasized}</span>); }
    return (
      <span className="SuggestionItem" id={suggestion.id}>
	    <div className="parentTopicNames">{suggestion.parentTopicNames}</div>
        {topicNameParts}
      </span>
    );
  };
  
  // Simply returns the name of the given suggestion
  getSuggestionValue(suggestion) {
	  return suggestion.topicName;
  }
  
  // The change event for the topic suggest
  topicInputOnChange(event, { newValue }) {
	  this.setState({
	    topicInputValue: newValue,
		canValidateTopic: false
	  });
  }

}

function Item(props) {
  switch (listView.mode) {
  case 'article':
    return Article(props);
  case 'picture':
    return Picture(props);
  default:
    return Picture(props);
  }
}

function getString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(val => getString(val)).join(', ');
  }
  return String(obj);
}

function Article(props) {
  let propList = (listView.props || []).map(key => {
    return <li>{key} : <strong>{getString(props.item[key])}</strong></li>;
  });

  let uri = `/item/${props.item.corpus}/${props.item.id}`;
  let name = getString(props.item[listView.name]);
  return (
    <div className="Article">
      <div className="ArticleTitle"><Link to={uri}>{name}</Link></div>
      <ul>{propList}</ul>
    </div>
  );
}

function Picture(props) {
  let uri = `/item/${props.item.corpus}/${props.item.id}`;
  let img = getString(props.item[listView.image]);
  let name = getString(props.item[listView.name]);
  let selected = props.corpora.state.selectedItems[props.item.id];
  return (
    <div className={selected ? "Item selected" : "Item"} onClick={_ => props.corpora._toggleItemState(props.item)}>
	  <span className="oi oi-check"></span>
      <Link to={uri} onClick={e => {if (props.corpora.state.selectMode) e.preventDefault();}}>
        <img src={img} alt={name}/>
      </Link>
      <div className="text-center">{name}</div>
    </div>
  );
}

function getSelectedItemsArray(items){
	let array = [];
	for(let itemId in items){
		if (items[itemId]){
			array.push(itemId);
		}
	}
	return array;
}

export default Corpora;
