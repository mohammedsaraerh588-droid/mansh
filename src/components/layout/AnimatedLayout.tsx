'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { motion, AnimatePresence } from 'framer-motion'

export default function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-[100dvh] relative">
      {/* Parallax Background */}
      <motion.div 
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-mint-soft to-gold-soft" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_30%_20%,var(--primary,theme(colors.sky.400)),transparent),radial-gradient(ellipse_30%_30%_at_80%_80%,var(--mint-soft),transparent)]" />
      </motion.div>

      {/* Navbar */}
      <motion.div 
        className="sticky top-0 z-50 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Navbar />
      </motion.div>

      {/* Glass Viewport */}
      <motion.main 
        className="relative pt-20 pb-12 min-h-[calc(100dvh-80px)]"
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="wrap mx-auto">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  )
}
