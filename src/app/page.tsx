import { Navbar, Footer } from "@/components";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import Hero from "./hero";
import ServicesSection from "./services-section";
import BookingSection from "./booking-section";
import InformationSection from "./information-section";
import { Testimonial } from "./testimonial";
import ContactSection from "./contact";

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <Hero />
      <BookingSection />
      <ServicesSection />
      <InformationSection />
      <Testimonial />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
