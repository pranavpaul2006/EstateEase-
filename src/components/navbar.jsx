import React from 'react'

function Navbar() {
  return (
    <div className='bg-blue-500 h-20 flex items-center justify-between px-6 fixed w-full z-10 '>
      <div className='flex items-center space-x-12'>
        <div className="flex space-x-4 items-center ">
          <img src="#" alt="EE" className="h-10" />
          <p className="font-bold text-2xl text-white">EstateEase</p>
        </div>
        <a href="#" className="navlink">BUY</a>
        <a href="#" className="navlink">RENT</a>
        <a href="#" className="navlink">SELL</a>
      </div>
      <div className="flex space-x-4">
        <button className="navbutt">WHISH</button>
        <button className="navbutt">LOGI</button>
      </div>
    </div>
  )
}

export default Navbar