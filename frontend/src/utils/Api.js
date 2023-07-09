class Api {
  constructor(options) {
    this._url = options.url;
    this._headers = options.headers;
  }
  _getStatusRequest(res) {
    if(!res.ok) {
      return Promise.reject('Ошибка: ' + res.status);
    }

    return res.json();
  }
  getData({ email, number, signal }) {
    return fetch(this._url, {
      method: 'POST',
      signal: signal,
      headers: this._headers,
      body: JSON.stringify({
        email: email,
        number: number,
      }),
    })
    .then(res => this._getStatusRequest(res))
  }
}

export const api = new Api({
  url: 'http://localhost:3002/info',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});
