import React from "react";
import Navbar from "./components/navbar";
import Home from "./components/home";
import { Route, Routes } from "react-router-dom";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Property from "./pages/Property";

function App() {
  return (
    <router>
      <div>
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/property" element={<Property />} />
        </Routes>
      </div>
    </router>
  );
}
export default App;
