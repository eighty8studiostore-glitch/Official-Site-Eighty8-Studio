"use client";
import Image from "next/image";

const clients = [
  { name: "Indian Dental Association", src: "/clients/ida.png" },
  { name: "Tauri", src: "/clients/tauri.svg" },
  { name: "Rust", src: "/clients/rust.svg" },
  { name: "React", src: "/clients/react.svg" }
];

export default function ClientGrid() {
  return (
    <section className="py-16 bg-zinc-200 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Title Section */}
        <h2 className="text-center text-sm font-semibold tracking-widest text-zinc-900 dark:text-zinc-400 uppercase mb-12">
          Brands and Associations that Trust Us
        </h2>

        {/* Static Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-16 items-center justify-items-center">
          {clients.map((client, index) => (
            <div
              key={index}
              className="group relative h-20 w-full max-w-[140px] flex items-center justify-center transition-all duration-300"
            >
              <Image
                src={client.src}
                alt={`${client.name} Logo`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain  transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 dark:invert-[0.1] dark:group-hover:invert-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}