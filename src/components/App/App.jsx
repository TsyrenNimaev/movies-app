import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';

import MoviesApi from '../../services-api';
import { Provider } from '../../context-app/Context';
import SearchForm from '../SearchForm';
import MovieList from '../MovieList';
import PaginationApp from '../PaginationApp';
import AlertError from '../AlertError';
import TabsButton from '../Tabs';

import './style.css';

export default class App extends Component {
  noConnection = 'No connection. Please check your network connection';
  anyError = 'Something went wrong.';

  state = {
    result: [],
    hasError: false,
    currentPage: 1,
    totalPages: null,
    value: '',
    isLoaded: false,
    genreList: [],
    tab: 'search',
    started: true,
  };

  MovieApi = new MoviesApi();

  componentDidMount() {
    this.getContent();
    this.getGenres();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.tab !== prevState.tab) {
      this.getContent();
    }
    if (this.state.value !== prevState.value) {
      this.getContent();
    }
    if (this.state.currentPage !== prevState.currentPage) {
      this.getContent();
    }
  }

  getContent = () => {
    const { currentPage, value, tab } = this.state;

    if (value.length === 0) {
      // eslint-disable-next-line no-unused-expressions
      !this.MovieApi.getResourses();
    } else if (tab === 'search' && value.length !== 0) {
      this.MovieApi.getResourses(currentPage, value)
        .then((movieList) => {
          this.setState({
            result: movieList.results,
            isLoaded: true,
            totalPages: movieList.total_pages,
            started: false,
          });
        })
        .catch(this.onError);
    } else {
      const guestId = localStorage.getItem('guestId');
      this.MovieApi.getRated(guestId)
        .then((rated) => {
          this.setState({
            result: rated.results,
            totalPages: rated.total_pages,
            isLoaded: true,
            started: false,
          });
        })
        .catch(this.onError);
    }
  };

  //меняем значение ключа по клику
  onChangeTabs = (key) => {
    this.setState({ tab: key });
  };

  //обработка ошибок
  onError = (error) => {
    this.setState({
      hasError: [true, error.message],
    });
  };

  //получаем введенное значение из инпута, меняем state и передаем значения в getContent
  searchMovie = (movie) => {
    this.setState({
      value: movie.target.value,
    });
    this.getContent(this.state.currentPage, movie.target.value);
  };

  //список жанров
  getGenres() {
    this.MovieApi.getGenres().then((res) => {
      this.setState({ genreList: res.genres });
    });
  }

  //пагинация, получаем текущую страницу
  togglePage = (page) => {
    this.setState({
      currentPage: page,
    });
    this.getContent(page, this.state.value);
    window.scroll(0, 0); //при выборе другой страницы, скроллим на вверх
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { result, genreList, currentPage, totalPages, tab, started, hasError } = this.state;

    if (hasError) {
      return <AlertError error={this.anyError} />;
    }
    const searchForm = tab === 'search' ? <SearchForm searchMovie={this.searchMovie} /> : null;

    return (
      <React.Fragment>
        <Online>
          <Provider value={genreList}>
            <section className="section">
              <TabsButton onChangeTabs={this.onChangeTabs} />
              {searchForm}
              <MovieList result={result} started={started} />
              <PaginationApp togglePage={this.togglePage} currentPage={currentPage} totalPages={totalPages} />
            </section>
          </Provider>
        </Online>
        <Offline>
          <AlertError error={this.noConnection} />
        </Offline>
      </React.Fragment>
    );
  }
}
