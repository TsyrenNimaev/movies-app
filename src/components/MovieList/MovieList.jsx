import React, { Component } from 'react';
import { Alert } from 'antd';

import MovieCards from '../MovieCards';

import './style.css';

export default class MovieList extends Component {
  render() {
    const { result, started } = this.props;

    if (started) {
      return <Alert message="Enter the name of a movie." type="info" showIcon />;
    } else if (result.length === 0) {
      return <Alert message="Not found." type="info" showIcon />;
    } else {
      const films = result.map((film) => <MovieCards key={film.id} {...film} />);

      return <ul className="movie-list">{films}</ul>;
    }
  }
}
