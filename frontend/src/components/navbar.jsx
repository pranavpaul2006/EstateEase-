import { Link } from "react-router-dom";
import React from "react";

function Navbar() {
  return (
    <div className="bg-blue-500 h-20 flex items-center justify-between px-6 fixed w-full z-10 ">
      <div className="flex items-center space-x-12">
        <div className="flex space-x-4 items-center ">
          <img src=".\src\images\estateease-logo.png" className="h-20 w-20" />
          <Link to="/">
            <p className="font-bold text-2xl text-white">EateEase</p>
          </Link>
        </div>
        <a href="#" className="navlink">
          BUY
        </a>
        <a href="#" className="navlink">
          RENT
        </a>
        <a href="#" className="navlink">
          SELL
        </a>
      </div>
      <div className="flex space-x-4">
        <Link to="/cart">
          <button className="navbutt">WISH</button>
        </Link>
        <Link to="/contact">
          <button className="navbutt">LOGIN</button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
