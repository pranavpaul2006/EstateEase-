import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';

function App() {
  return (
    <div>   
      <div>
        <Navbar />
      </div>
      <div style={{ paddingTop: '80px' }}>
        <Hero />
      </div>
    </div>
  );
}
export default App;