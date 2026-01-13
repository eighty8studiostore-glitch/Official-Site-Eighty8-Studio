import { ArrowRight, Code2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-25 pb-0 lg:pt-32 lg:pb-16 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-hidden">

      {/* --- Background Elements --- */}
      {/* 1. Static Grid Pattern */}
      <div className="absolute inset-0 -z-20 h-full w-full  "></div>

      {/* 2. Static Ambient Glows (No animation) */}
      <div className="absolute top-10 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10 mix-blend-multiply " />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px] -z-10 mix-blend-multiply " />


      {/* --- Left Content: Copywriting --- */}
      <div className="flex-1 text-left md:text-center lg:text-left z-10 gap-2">



        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-0 text-zinc-900 ">
          Let Us Make Your Business Easy <br className="hidden lg:block" />
            With Our Solutions
         
        </h1>

        <div className="bg-[#FF4F00] w-24 h-1 mb-1 mt-4"></div>

        <p className="text-lg md:text-xl text-zinc-600  max-w-2xl mx-auto lg:mx-0 mb-6 leading-relaxed font-medium">
          We engineer Unique Web Apps, Desktop Software, Mobile Applications and Scalable Systems for brands that demand perfection.
        </p>

        {/* CTA Buttons (Static) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button className="px-8 py-4 bg-zinc-900  text-white font-bold rounded-full hover:bg-zinc-800  transition-colors">
            <span className="flex items-center justify-center gap-2 hover:gap-5 transition-all">
              GET STARTED FOR FREE
              <ArrowRight size={18} />
            </span>
          </button>


        </div>

      </div>

      {/* --- Right Content: The Big Static Image --- */}
      <div className="flex-1 relative w-full flex justify-center lg:justify-end">

        {/* Simple decorative glow behind image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-tr from-blue-100 to-violet-100  rounded-full blur-3xl -z-10" />

        <Image
          src="/vector/hero1.jpg"
          alt="Digital Empire Visual"
          width={800}
          height={800}
          priority
          className="relative z-10 w-full max-w-[600px] lg:max-w-full h-auto object-contain "
        />

      </div>

    </section>
  );
}