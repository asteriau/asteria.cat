'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const icons = {
  home: (
    <svg viewBox="0 -960 960 960" className="w-6 h-6" fill="currentColor">
      <path d="M187.27-147.27v-440L480-807.69l292.73 220.65v439.77H558.27v-264.46H401.92v264.46H187.27Z" />
    </svg>
  ),
  about: (
    <svg viewBox="0 -960 960 960" className="w-6 h-6" fill="currentColor">
      <path d="M452.42-294.04h55.96v-225.15h-55.96v225.15Zm27.47-291.19q13.23 0 22.01-8.68 8.79-8.69 8.79-21.91t-8.68-22.01q-8.68-8.78-21.9-8.78-13.23 0-22.01 8.68-8.79 8.68-8.79 21.9 0 13.22 8.68 22.01 8.68 8.79 21.9 8.79Zm.2 477.15q-77.15 0-145.06-29.32-67.92-29.33-118.16-79.6-50.23-50.27-79.51-118.05-29.28-67.79-29.28-144.86 0-77.15 29.32-145.06 29.33-67.92 79.6-118.16 50.27-50.23 118.05-79.51 67.79-29.28 144.86-29.28 77.15 0 145.06 29.32 67.92 29.33 118.16 79.6 50.23 50.27 79.51 118.05 29.28 67.79 29.28 144.86 0 77.15-29.32 145.06-29.33 67.92-79.6 118.16-50.27 50.23-118.05 79.51-67.79 29.28-144.86 29.28Z" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 -960 960 960" className="w-6 h-6" fill="currentColor">
      <path d="M108.08-130.58v-653.9q0-28.42 19.91-48.33 19.92-19.92 48.27-19.92h607.48q28.35 0 48.27 19.92 19.91 19.91 19.91 48.27v449.08q0 28.36-19.91 48.27-19.92 19.92-48.27 19.92H244.77L108.08-130.58Zm146.77-283.46h292.73V-470H254.85v55.96Zm0-118.38h450.3v-55.96h-450.3v55.96Zm0-118.39h450.3v-55.96h-450.3v55.96Z" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 -960 960 960" className="w-6 h-6" fill="currentColor">
      <path d="m384.81-353.89 39.73-40.03L338.46-480l85.39-85.38-39.73-40.04L258.69-480l126.12 126.11Zm190.38 0L701.31-480 575.19-606.11l-39.73 39.84L621.73-480l-86.27 86.08 39.73 40.03ZM215.54-147.27q-28.5 0-48.38-19.89-19.89-19.88-19.89-48.38v-528.92q0-28.5 19.89-48.38 19.88-19.89 48.38-19.89h528.92q28.5 0 48.38 19.89 19.89 19.88 19.89 48.38v528.92q0 28.5-19.89 48.38-19.88 19.89-48.38 19.89H215.54Z" />
    </svg>
  ),
}

export function MobileNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Calculate the active index for the sliding pill
  const activeIndex = NAV_ITEMS.findIndex((item) => pathname === item.path)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-elevated backdrop-blur-md border-t border-border/60 h-16">
        <div className="relative flex justify-center items-center h-full">
          <ul className="flex items-center gap-6 relative">
            <motion.div
              className="absolute left-0 w-12 h-12 flex items-center justify-center pointer-events-none"
              animate={{ 
                x: activeIndex * 72, // 12w + 6 gap = 72px per item
                y: "calc(50% - 35px)" // This centers it vertically relative to the icon
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                mass: 0.5 
              }}
            >
              <div className="w-10 h-6 bg-[rgba(141,163,185,0.18)] rounded-[12px]" />
            </motion.div>
            
            {NAV_ITEMS.map((item, idx) => {
              const isActive = pathname === item.path
              const iconKey = item.label as keyof typeof icons
              return (
                <li key={item.path} className="relative flex flex-col items-center justify-center w-12 h-12 gap-1">
                  <Link href={item.path} className="flex flex-col items-center justify-center w-full h-full gap-1">
                    <span
                      className={cn(
                        'transition-all duration-200 relative z-10',
                        isActive ? 'text-accent opacity-100' : 'text-fg opacity-60'
                      )}
                    >
                      {icons[iconKey]}
                    </span>
                    <span
                      className={cn(
                        'text-[12px] font-medium lowercase tracking-[0.035em] relative z-10',
                        isActive ? 'text-accent opacity-100' : 'text-fg opacity-60'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <button
            aria-label="Toggle menu"
            onClick={() => setIsOpen((v) => !v)}
            className="absolute right-4 top-0 bottom-0 m-auto w-12 h-12 flex items-center justify-center"
          >
            <motion.div className="w-6 h-6 relative" animate={isOpen ? 'open' : 'closed'}>
              <motion.span
                className="absolute w-6 h-0.5 bg-fg rounded"
                variants={{ closed: { rotate: 0, y: -6, opacity: 0.6 }, open: { rotate: 45, y: 0, opacity: 1 } }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute w-6 h-0.5 bg-fg rounded"
                variants={{ closed: { opacity: 0.6 }, open: { opacity: 0 } }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute w-6 h-0.5 bg-fg rounded"
                variants={{ closed: { rotate: 0, y: 6, opacity: 0.6 }, open: { rotate: -45, y: 0, opacity: 1 } }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-elevated backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="h-full flex flex-col items-center justify-center gap-10 pb-24"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-s  text-accent mb-2">asteria.cat</span>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path
                const iconKey = item.label as keyof typeof icons
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex flex-col items-center gap-2 text-lg lowercase tracking-[0.05em]',
                      isActive ? 'text-accent' : 'text-fg/70'
                    )}
                  >
                    {icons[iconKey]}
                    {item.label}
                  </Link>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}