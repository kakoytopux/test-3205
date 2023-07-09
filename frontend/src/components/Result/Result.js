import React from "react";
import './Result.css';
import Loader from "../Loader/Loader";

export default function Result({ data, textErr, loader }) {
  return (
    <div className="result">
      <p className="result__err">{textErr}</p>
      {loader && <Loader />}
      <div className="result__container">
        <h3 className="result__category">Email</h3>
        <h3 className="result__category">Number</h3>
      </div>
      <ul className="result__lists">
        {data?.info.map((item, index) =>
          <li className="result__list" key={index}>
            <p className="result__text">{item.email}</p>
            <p className="result__text">{item.number}</p>
          </li>
        )}
      </ul>
    </div>
  );
}
