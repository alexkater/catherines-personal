"use client";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/573105967326"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
      aria-label="WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-2xl" />
    </a>
  );
}

export default FloatingWhatsApp;
