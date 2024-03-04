import React, { useState } from "react";

// search = 來自Homepage的props
const Search = ({ search, setInput }) => {
  const inputHandler = (e) => {
    setInput(e.target.value); //傳送到setInput的state(input)
  };
  return (
    <div className="search">
      <input className="input" onChange={inputHandler} type="text" />
      <button onClick={search}>Search</button>
    </div>
  );
};

export default Search;
