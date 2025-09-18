import React from 'react'

function Hero() {
  return (
    <div className=" h-screen  pt-40  bg-[url('.\images\bg-hero-estateease.jpg')] bg-contain ">
        <div className=' flex justify-center gap-x-20'>
            <div>
                <input
                type="text"
                placeholder="Enter location or city"
                className="input-style"
                />  
                <button className='inp-button'>V</button>
            </div>
            <div>
                <input
                type="text"
                placeholder="Property type"
                className="input-style"
                />
                <button className='inp-button'>V</button>
            </div>
        <button className="bg-blue-500 text-white h-10 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Search
        </button>
        </div>
    </div>
  )
}

export default Hero