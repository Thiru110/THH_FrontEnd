import React from "react";
import "./logo.css";
import logo from "../../../../src/logo.svg";

function Logo() {
  return (
    <div>
      <header>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default Logo;
