import React from 'react';
import Hero from './hero';
import PropertyGrid from './property_grid';
import Footer from './footer';

function Home({ properties, wishlist, onToggleWishlist }) {
  return (
    <div className="pt-20">
      <Hero
        properties={properties}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
      />

      {/* <PropertyGrid /> */}
      <Footer/>
    </div>
  );
}

export default Home;