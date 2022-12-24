export default class MoviesApi {
  _apiBase = 'https://api.themoviedb.org/3/';
  _apiKey = 'api_key=1f9136edf3bdbd4f9842072f95ddddf7';

  async getApi(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to load data');
    } else return await response.json();
  }

  //получаем фильмы по названию
  async getResourses(page = 1, search) {
    const response = await this.getApi(
      `${this._apiBase}search/movie?${this._apiKey}&language=en-US&query=${search}&page=${page}&include_adult=false`
    );
    return response;
  }

  //получаем жанры
  async getGenres() {
    const res = await this.getApi(`${this._apiBase}/genre/movie/list?${this._apiKey}&language=en-US`);
    return res;
  }

  //настраиваем рейтинги
  async guestSession() {
    const response = await this.getApi(`${this._apiBase}/authentication/guest_session/new?${this._apiKey}`);
    return response.guest_session_id;
  }

  async postRated(value, movieId, guestId) {
    await fetch(`${this._apiBase}movie/${movieId}/rating?${this._apiKey}&guest_session_id=${guestId}`, {
      method: 'POST',
      body: JSON.stringify({
        value: value,
      }),
      headers: { 'content-type': 'application/json;charset=utf-8' },
    });
  }

  async getRated(guestId) {
    const response = await this.getApi(
      `${this._apiBase}/guest_session/${guestId}/rated/movies?${this._apiKey}&language=en-US&sort_by=created_at.asc`
    );
    return response;
  }
}
