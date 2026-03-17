"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  visible: boolean;
}

export default function LoadingScreen({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <p className="text-3xl font-bold text-blue-gray-800 tracking-tight">
            Dra. Catherine González
          </p>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">
            Especialista en Neumología
          </p>
          <div className="relative mt-8 flex h-10 w-10 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-5 w-5 rounded-full bg-blue-600" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
