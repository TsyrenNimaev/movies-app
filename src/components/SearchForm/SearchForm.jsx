import React, { Component } from 'react';
import debounce from 'lodash.debounce';

import './style.css';

export default class SearchForm extends Component {
  render() {
    const { searchMovie } = this.props;
    return (
      <form className="search-form">
        <label className="search-label">
          <input
            type="text"
            placeholder="Type to search..."
            className="search-input"
            onChange={debounce(searchMovie, 500, [])}
            autoFocus
          />
        </label>
      </form>
    );
  }
}
