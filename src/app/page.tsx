// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import InformationSection from "./information-section";
// import Testimonial from "./testimonial";
import BookingSection from "./booking-section";
import ContactSection from "./contact";

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <Hero />
      <BookingSection />
      <InformationSection />
      <ContactSection />
      {/* <Testimonial /> */}
      <Footer />
    </>
  );
}
