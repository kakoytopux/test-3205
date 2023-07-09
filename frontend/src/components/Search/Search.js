import React, { useState, useEffect } from "react";
import './Search.css';
import { api } from '../../utils/Api';
import Result from "../Result/Result";

export default function Search() {
  const [valueEmail, setValueEmail] = useState('');
  const [valueNumber, setValueNumber] = useState('');
  const [data, setData] = useState(null);
  const [textErr, setTextErr] = useState('');
  const [loader, setLoader] = useState(false);
  const [controllers, setControllers] = useState([]);

  function setEmailField(evt) {
    setValueEmail(evt.target.value);
  }
  function setNumberField(evt) {
    setValueNumber(evt.target.value);
  }
  function onSubmit(evt) {
    evt.preventDefault();
    setTextErr('');
    setData(null);
    setLoader(true);
    closeRequest();

    const controller = new AbortController();
    setControllers([...controllers, controller]);
    const signal = controller.signal;

    const newValNumber = valueNumber.replace(/-/g, '');

    api.getData({
      email: valueEmail,
      number: newValNumber,
      signal: signal,
    })
    .then(res => {
      if(res.info.length === 0) {
        setTextErr('Ничего не найдено.');
        return;
      }

      setData(res);
    })
    .catch(err => {
      if(err.name === 'AbortError') {
        console.log('Произошел сброс запроса.');
        return;
      }

      setTextErr('Произошла ошибка!');
      console.log(err);
    })
    .finally(() => {
      if(signal.aborted) {
        setLoader(true);
        return;
      }

      setLoader(false);
    });
  }

  useEffect(() => {
    setValueNumber(valueNumber.replace(/([0-9a-z]{2}(?!-|$))/g, '$1-'));
  }, [valueNumber])

  function closeRequest() {
    controllers.forEach(item => {
      item.abort();
    });
  }

  return (
    <section className='search'>
      <div className="search__container">
        <h1 className='search__title'>Поиск данных</h1>
        <form className='form' method='post' onSubmit={onSubmit}>
          <div className='form__container'>
            <label htmlFor='email' className="form__label">Email</label>
            <input
            type='email'
            className='form__field'
            id='email'
            name='email'
            required
            placeholder="email@email.com"
            value={valueEmail}
            onChange={setEmailField}
            />
          </div>
          <div className='form__container'>
            <label htmlFor='number' className="form__label">Number</label>
            <input
            type='tel'
            className='form__field'
            id='number'
            name='number'
            placeholder="00-00-00"
            value={valueNumber}
            onChange={setNumberField}
            maxLength={8}
            />
          </div>
          <button type='submit' className='form__submit'>Найти</button>
        </form>
        <Result data={data} textErr={textErr} loader={loader} />
      </div>
    </section>
  );
}