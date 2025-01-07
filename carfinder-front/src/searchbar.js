// src/SearchBar.js
import React, { useState } from 'react';
import './searchbar.css';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Pesquisar..."
        className="search-input"
        aria-label="Campo de pesquisa"
      />
      <button className="search-btn">Pesquisa Avançada</button>
    </div>
  );
}

export default SearchBar;
