import React from 'react'

function Hero() {
  return (
    <div className='h-screen mb-100'>
        <div className=" h-64  pt-40  bg-[url('.\images\bg-hero-estateease.jpg')] bg-fit">
            <div className='flex justify-center gap-x-20 mt-[-90px]'>
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
        <div className='grid mt-8 grid-cols-[1fr_1fr_1fr] gap-8 px-8'>
            <div className='border h-90 '>
                <div className='border h-50'>
                    <img src="src\images\bg-hero-estateease.jpg" className='h-50 w-90'/>
                </div>
                <div>
                    <div><p className='border'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facilis?
                    </p></div>
                    <div className='flex justify-center '>
                        <div>
                            <p className='border'>
                            Location
                            </p>
                        </div>
                        <div>
                            <p className='border'>
                            price
                            </p>
                        </div>
                    </div>
                    <div><p className='border'>
                        price
                    </p></div>
                </div>
            </div>
            <div className='border h-90 '>
                <div className='border h-50'>
                    <img src="src\images\bg-hero-estateease.jpg" className='h-50 w-90'/>
                </div>
                <div>
                    <div><p className='border'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facilis?
                    </p></div>
                    <div className='flex justify-center '>
                        <div>
                            <p className='border'>
                            Location
                            </p>
                        </div>
                        <div>
                            <p className='border'>
                            price
                            </p>
                        </div>
                    </div>
                    <div><p className='border'>
                        price
                    </p></div>
                </div>
            </div>
            <div className='border h-90 '>
                <div className='border h-50'>
                    <img src="src\images\bg-hero-estateease.jpg" className='h-50 w-90'/>
                </div>
                <div>
                    <div><p className='border'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facilis?
                    </p></div>
                    <div className='flex justify-center '>
                        <div>
                            <p className='border'>
                            Location
                            </p>
                        </div>
                        <div>
                            <p className='border'>
                            price
                            </p>
                        </div>
                    </div>
                    <div><p className='border'>
                        price
                    </p></div>
                </div>
            </div>
            <div className='border h-90 '>
                <div className='border h-50'>
                    <img src="src\images\bg-hero-estateease.jpg" className='h-50 w-90'/>
                </div>
                <div>
                    <div><p className='border'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facilis?
                    </p></div>
                    <div className='flex justify-center '>
                        <div>
                            <p className='border'>
                            Location
                            </p>
                        </div>
                        <div>
                            <p className='border'>
                            price
                            </p>
                        </div>
                    </div>
                    <div><p className='border'>
                        price
                    </p></div>
                </div>
            </div>

            <div className='border h-90 '>
                <div className='border h-50'>
                    <img src="src\images\bg-hero-estateease.jpg" className='h-50 w-90'/>
                </div>
                <div>
                    <div><p className='border'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facilis?
                    </p></div>
                    <div className='flex justify-center '>
                        <div>
                            <p className='border'>
                            Location
                            </p>
                        </div>
                        <div>
                            <p className='border'>
                            price
                            </p>
                        </div>
                    </div>
                    <div><p className='border'>
                        price
                    </p></div>
                </div>
            </div>

            <div className='border h-90  '>
                <div className='border h-50'>
                    <img src="src\images\bg-hero-estateease.jpg" className='h-50 w-90'/>
                </div>
                <div>
                    <div><p className='border'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, facilis?
                    </p></div>
                    <div className='flex justify-center '>
                        <div>
                            <p className='border'>
                            Location
                            </p>
                        </div>
                        <div>
                            <p className='border'>
                            price
                            </p>
                        </div>
                    </div>
                    <div><p className='border'>
                        price
                    </p></div>
                </div>
            </div>
        </div>
    </div>
    
  )
}

export default Hero