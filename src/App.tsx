/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Impact from './components/Impact';
import Programs from './components/Programs';
import Testimonials from './components/Testimonials';
import Donation from './components/Donation';
import Gallery from './components/Gallery';
import Team from './components/Team';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#D4AF37] selection:text-[#001F3F]">
      <Navbar />
      <main>
        <Hero />
        
        <section id="about" className="py-24">
          <About />
        </section>

        <section id="impact" className="py-24">
          <Impact />
        </section>

        <section id="programs" className="py-24">
          <Programs />
        </section>

        <section id="testimonials" className="py-24">
          <Testimonials />
        </section>

        <section id="donation" className="py-24">
          <Donation />
        </section>

        <section id="gallery" className="py-24">
          <Gallery />
        </section>

        <section id="team" className="py-24">
          <Team />
        </section>

        <section id="partners" className="py-24">
          <Partners />
        </section>

        <section id="contact" className="py-24">
          <Contact />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

