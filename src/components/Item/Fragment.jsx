import React, { Component } from 'react';
import lien from '../../images/lien_logo.svg';

export default class Fragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idTextToAnalyse: null
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextState.idTextToAnalyse) {
      let found = nextProps.items.find(
        text => text.id === nextState.idTextToAnalyse
      );
      if (!found) return { idTextToAnalyse: null };
    }
    return false;
  }

  render() {
    const generatedTextDescription = this._generateTextDescription();
    const generatedTextFragment = this._generateTextFragment();
    return (
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="text-center">
            <tr>
              <th scope="col" style={{ width: '30%' }}>
                Items
              </th>
              <th scope="col">Fragments d'un item</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0' }}>
                <table style={{ border: 'none' }} className="w-100">
                  <tbody>{generatedTextDescription}</tbody>
                </table>
              </td>
              <td style={{ padding: '0' }}>
                <table style={{ border: 'none' }} className="w-100">
                  <tbody>{generatedTextFragment}</tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  _generateTextDescription() {
    const selectId = this.selectIdTextToAnalyse;
    const idTextToAnalyse = this.state.idTextToAnalyse;
    return this.props.items.map((text, id) => {
      let { resource } = text;
      resource = resource ? (
        <a href={resource[0]}>
          <img
            style={{ height: '15px', weight: '15px' }}
            alt="lien le texte d'origine"
            src={lien}
          />
        </a>
      ) : null;
      const idIdentique = idTextToAnalyse === text.id;
      const class_name = idIdentique ? 'item textSelected' : 'item';
      return (
        <tr className={class_name} key={id} onClick={() => selectId(text.id)}>
          <td>
            <p className="name">
              <b>name :</b> {text.name} {resource}
            </p>
            <p className="date" />
            <p className="author" />
          </td>
        </tr>
      );
    });
  }

  selectIdTextToAnalyse = id => {
    window.scrollTo(0, 0);
    if (id === this.state.idTextToAnalyse) {
      this.setState({ idTextToAnalyse: null });
    } else {
      this.setState({ idTextToAnalyse: id });
    }
  };

  _generateTextFragment() {
    if (this.state.idTextToAnalyse === null) {
      let fragmentSelect = this.props.items.map(fragment => {
        return Object.values(fragment);
      });
      if (this.props.selection.length !== 0) {
        fragmentSelect = fragmentSelect.map(fragments => {
          return fragments.filter(fragment => {
            return this.props.selection.every(selection => {
              return (fragment.topic || []).find(t => {
                return t.id === selection;
              });
            });
          });
        });
      }
      return fragmentSelect.map(fragments => {
        return fragments.map((fragment, idFragment) => {
          return (
            <tr key={idFragment}>
              <td>
                {fragment.text
                  ? fragment.text.map((text, idText) => (
                      <p key={idText} style={{ margin: 0 }}>
                        {text}
                      </p>
                    ))
                  : null}
              </td>
            </tr>
          );
        });
      });
    } else {
      let fragments = this.props.items.find(
        text => text.id === this.state.idTextToAnalyse
      );
      let fragmentSelect = Object.values(fragments);
      if (this.props.selection.length !== 0) {
        fragmentSelect = fragmentSelect.filter(fragments => {
          return this.props.selection.every(selection => {
            return (fragments.topic || []).find(t => {
              return t.id === selection;
            });
          });
        });
      }
      return fragmentSelect.map((fragment, idFragment) => {
        return (
          <tr key={idFragment}>
            <td>
              {fragment.text
                ? fragment.text.map((text, idText) => (
                    <p key={idText} style={{ margin: 0 }}>
                      {text}
                    </p>
                  ))
                : null}
            </td>
          </tr>
        );
      });
    }
  }
}
