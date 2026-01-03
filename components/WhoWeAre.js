import React from 'react';
import Image from 'next/image';

// Ensure you have the image file at this path in your public directory
// e.g., public/images/meeting-background.png
const backgroundImage = "/vector/whoweare.jpeg"; 

const WhoWeAre = () => {
  return (
    <section id='about' className="relative w-full h-[100vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      
      {/* --- 1. Background Image Layer (Using Next Image) --- 
          - fill: Makes the image fill the parent container.
          - objectFit="cover": Ensures the image covers the area without distortion.
          - quality={90}: Sets a high image quality.
      */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={backgroundImage} // Replace with your actual image path
          alt="Team working together in a colorful office" 
          fill
          style={{ objectFit: 'cover' }}
          quality={90}
          priority // Loads this image quickly as it's above the fold
        />
      </div>

      {/* --- 2. Subtle Gradient Overlay --- 
          Removed the blur (`backdrop-blur`).
          Added a subtle vertical gradient from the bottom (`from-black/60`) 
          to transparent at the top to ensure text readability against the colorful background.
      */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* --- 3. Content Layer --- 
          Text colors adjusted to solid white for maximum contrast.
      */}
      <div className="relative z-20 max-w-4xl px-6 text-center">
        
        {/* Subtle Tagline */}
        <span className="inline-block py-1 px-3 mb-6 border border-white/30 rounded-full bg-white/10 text-xs font-medium tracking-[0.2em] text-white uppercase">
          Our Philosophy
        </span>

        {/* Main Headline - Solid White for readability */}
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight shadow-sm">
          Precision Down to the <br className="hidden md:block" />
          Molecule.
        </h2>

        {/* The Body Paragraph - Solid Light Gray */}
        <p className="text-lg md:text-xl text-gray-100 font-medium leading-relaxed max-w-2xl mx-auto shadow-sm">
          We believe the difference between good and great lies in the pixels you barely notice. 
          We work on a <span className="text-white font-bold">minute level</span>, obsessed with crafting 
          digital experiences that feel effortless, robust, and undeniably premium.
        </p>

        {/* Optional Action Button */}
        <div className="mt-10">
          <button className="group relative px-8 py-3 overflow-hidden rounded-full bg-white text-black font-semibold transition-all hover:bg-gray-200 shadow-md">
            <span className="relative z-10">See Our Process</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default WhoWeAre;