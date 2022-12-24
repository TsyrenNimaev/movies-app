/* eslint-disable indent */
import React, { Component } from 'react';
import { format } from 'date-fns';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Rate } from 'antd';

import MoviesApi from '../../services-api';
import { Consumer } from '../../context-app/Context';
import './style.css';
import icon from '../../assets/img/not_found.png';

export default class MovieCards extends Component {
  _imgBase = 'https://image.tmdb.org/t/p/w500';

  MovieApi = new MoviesApi();

  state = {
    loaded: false,
    hasError: false,
    guestId: null,
    rate: null,
  };

  componentDidMount() {
    this.putGenres();
    this.guestSession();
    this.saveRated();
  }

  //меняем state если идет загрузка контента
  onLoaded() {
    this.setState({
      loaded: true,
    });
  }

  //обрабатываем ошибки
  onError = () => {
    this.setState({
      loaded: false,
      hasError: true,
    });
  };

  //обрезаем описание к фильму
  descriptionCut(description) {
    let shortDescription = description.split(' ').slice(0, 27).join(' ');
    return shortDescription.split(' ').length >= 27 ? shortDescription + '...' : shortDescription + '';
  }

  //получаем дату релиза
  releaseDate = (release_date) => (release_date ? format(new Date(release_date), 'MMM dd, yyyy') : 'Date is unknown');

  //получаем жанры фильмов
  putGenres = () => {
    return (
      <Consumer>
        {(genreList) => {
          const { genre_ids } = this.props;
          const currentGenre = genreList.filter((el) => genre_ids.indexOf(el.id) > -1);
          const genres = currentGenre.map((el) => {
            <li key={el.id} className="genre">
              {el.name}
            </li>;
          });
          return <ul className="movie-genre-list">{genres}</ul>;
        }}
      </Consumer>
    );
  };

  //рейтинги
  guestSession = () => {
    this.MovieApi.guestSession().then((res) => {
      const guestId = localStorage.getItem('guestId');
      if (guestId) {
        this.setState({ guestId: guestId });
      } else {
        localStorage.setItem('guestId', res);
        this.setState({ guestId: res });
      }
    });
  };

  sendRating = (value) => {
    this.setState({ rate: value });
    this.MovieApi.postRated(value, this.props.id, this.state.guestId);
    localStorage.setItem(`${this.props.id}`, value);
  };

  saveRated() {
    const rate = localStorage.getItem(this.props.id);
    if (rate !== null && rate !== 0) {
      this.setState({ rate: rate });
    }
  }

  render() {
    const { title, overview, poster_path, release_date } = this.props;
    const { loaded, rate } = this.state;

    const spinner = <LoadingOutlined style={{ fontSize: 110 }} spin />;

    let posterUrl = `${this._imgBase}${poster_path}`; //путь к постеру

    //если постера нет, то заглушка
    let noPosterURl = icon;
    let poster = posterUrl.includes('null') ? noPosterURl : posterUrl;

    let colorRate = { borderColor: 'none' };
    switch (true) {
      case rate <= 3:
        colorRate = { borderColor: '#E90000' };
        break;
      case rate <= 5:
        colorRate = { borderColor: '#E97E00' };
        break;
      case rate <= 7:
        colorRate = { borderColor: '#E9D100' };
        break;
      case rate > 7:
        colorRate = { borderColor: '#66E900' };
        break;
      default:
        colorRate = { borderColor: 'transparent' };
        break;
    }

    return (
      <li className="movie-card">
        {!loaded && <Spin indicator={spinner} />}
        <img
          src={poster}
          alt={title}
          className="movie-card-img"
          style={!loaded ? { display: 'none' } : null}
          onLoad={() => this.setState({ loaded: true })}
        />
        <div className="wrapper-card">
          <span className="rate-circle" style={colorRate}>
            {rate}
          </span>
          <h2 className="movie-title">{title}</h2>
          <span className="movie-date-release">{this.releaseDate(release_date)}</span>
          {this.putGenres()}
          <p className="description-paragraph">{this.descriptionCut(overview)}</p>
          <Rate allowHalf count={10} onChange={this.sendRating} value={Number(rate)} />
        </div>
      </li>
    );
  }
}
