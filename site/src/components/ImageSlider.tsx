'use client';

import { useEffect, useState } from 'react';

interface ImageSliderProps {
  width: string;
  height: string;
}

export default function ImageSlider({ width, height }: ImageSliderProps) {
  // Manually specify the image paths
  const images = [
    '/images/Screenshots/img1.jpg',
    '/images/Screenshots/img2.png',
    '/images/Screenshots/img3.jfif',
    '/images/Screenshots/img4.png',
    '/images/Screenshots/img5.jpg',
    '/images/Screenshots/img6.jfif',
    '/images/Screenshots/img7.jpg',
    '/images/Screenshots/img8.png',
    '/images/Screenshots/img9.jpg',
    '/images/Screenshots/img10.jfif',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 500); // Duration for fade-out
    }, 4000); // 4-second interval

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Title with elegant styling */}
      <h2 className="text-2xl md:text-2xl font-bold text-gray-800 text-center">
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Watch what your employees and kids are doing on their PC!
        </span>
      </h2>

      <div
        className="relative overflow-hidden rounded-lg shadow-2xl border-2 border-gray-300"
        style={{ width, height }}
      >
        {/* Gradient overlay for a subtle effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-300 opacity-20 pointer-events-none"></div>

        {/* Image with fade-in/out transition */}
        <img
          src={images[currentIndex]}
          alt={`Screenshot ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${
            fade ? 'translate-x-0' : 'translate-x-full'
          }`}
        />

        {/* Caption or overlay text */}
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2">
          {/* Screenshot {currentIndex + 1} */}
        </div>

        {/* Navigation Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-gray-500'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
