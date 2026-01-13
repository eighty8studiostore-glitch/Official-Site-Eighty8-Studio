import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesBento from "@/components/ServicesBento";
import ProductShowcase from "@/components/ProductShowcase";
import ClientMarquee from "@/components/ClientMarquee";
import { FadeDivider } from "@/components/FadeDivider";
import WhoWeAre from "@/components/WhoWeAre";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fdfdfd] overflow-x-hidden selection:bg-blue-500/30">
      <Navbar />
      
      <div className="flex flex-col gap-0">
        <Hero />
        <ProductShowcase />
        <ClientMarquee />
        <ServicesBento />
        <WhoWeAre />
        <ContactForm />
        <Footer />
      </div>
    </main>
  );
}