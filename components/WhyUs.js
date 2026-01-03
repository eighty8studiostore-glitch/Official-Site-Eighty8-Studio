import { Zap, ShieldCheck, Scaling } from "lucide-react";

export default function WhyUs() {
  const features = [
    {
      icon: Zap,
      title: "Blazing Fast",
      desc: "Optimized for 100/100 Lighthouse scores. Speed is not a luxury, it is a requirement."
    },
    {
      icon: ShieldCheck,
      title: "Ironclad Security",
      desc: "Enterprise-grade encryption and data handling protocols baked into every line of code."
    },
    {
      icon: Scaling,
      title: "Infinite Scale",
      desc: "Architectures designed to handle 10 users or 10 million without breaking a sweat."
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-gradient-to-b from-black to-slate-950 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div key={i} className="text-center group">
              <div className="mx-auto w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
                <f.icon className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}