import React from "react";
import "./header.css";
import "./searchbar.css";
import SearchBar from "./searchbar";
import { Link } from "react-router-dom";
import logo from "./assets/logo.jpg";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/carros">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
          CarFinder
        </div>
        <SearchBar />  

        <div className="login">

        <Link to="/comparar">
          <button>Comparador de Carros</button>
        </Link>  
        
          <Link to="/login">
            <button>Login</button>
          </Link>

          <Link to="/register">
            <button>Register</button>
          </Link>
          <Link to="/perfil" className="profile-icon-link">
            <AccountCircleIcon className="profile-icon" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
