//handle data base
// update order logic
// information and email on ordering



"use client"
import React, { useEffect, useState } from 'react';
import Navbar from './navbar/page';

const App = () => {
  const images = [
    'image/adidas.jpg?text=Slide+1',
    'image/puma.jpg?text=Slide+2',
    'image/crocs.jpg?text=Slide+3',
    'image/shoes.jpg?text=Slide+4',
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#fef5e4] font-sans text-center">
      {/* Header */}
      <header className="py-6 ">
        <Navbar />

        {/* Slideshow */}
        <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg -mt-6">
          <div className="relative h-64 sm:h-96">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}

                  alt={`Slide ${index + 1}`}
                  className="w-full h-full md:p-20 md:pt-0 object-cover lg:object-center"
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-75 transition"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded hover:bg-opacity-75 transition"
          >
            &#10095;
          </button>
        </div>
      </header>

      {/* Categories */}
      <section className="bg-green-800 text-white py-8 px-4">
        <h2 className="text-3xl font-bold font-serif mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'crocs', img: '/image/crocsdisplay.png' },
            { name: 'puma', img: '/image/pumashoes.png' },
            { name: 'nike', img: '/image/nikeshoes.png' },
            { name: 'adidas', img: '/image/adidasshoes.png' },
          ].map((item) => (
            <button onClick={()=>{window.location.assign(`/products?name=${item.name}`)}} key={item.name} className="bg-white  p-2 border-2 border-black rounded-xl shadow-2xl">
              <img src={item.img} alt={item.name} className="w-30 h-30 mx-auto" />
              <p className="text-black text-2xl font-sans font-bold">{item.name}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
