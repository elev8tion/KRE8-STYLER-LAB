'use client';

import HolographicLoader from '@/components/HolographicLoader';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
      <HolographicLoader />
      
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
          KRE8-Styler Lab
        </h1>
        <p className="text-gray-500 text-sm">
          Click the logo to navigate
        </p>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 right-8 text-gray-600 text-xs">
        <div>KRE8-Styler Lab v0.1.0</div>
        <div className="mt-1">© 2025 KRE8 Labs</div>
        <div className="mt-2 text-cyan-400">Port: 3009</div>
      </div>
    </div>
  );
}