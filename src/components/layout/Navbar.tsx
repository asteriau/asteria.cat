'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-0 right-0 top-0 h-[60px] bg-elevated backdrop-blur-xl border-b border-border/60 z-[110] hidden md:flex justify-center items-center"
    >
      <ul className="relative flex justify-center items-center h-full m-0 p-0 gap-7">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path
          
          return (
            <li key={item.path} className="h-full flex items-center relative">
              <Link
                href={item.path}
                className={cn(
                  'relative px-3 py-2 border-none bg-transparent flex items-center justify-center cursor-pointer',
                  'text-[0.95rem] font-normal lowercase tracking-[0.02em]',
                  'transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]'
                )}
              >
                <motion.span
                  className={cn(
                    'relative',
                    isActive 
                      ? 'text-transparent bg-clip-text name-gradient font-medium'
                      : 'text-fg/50 hover:text-fg/70'
                  )}
                  initial={{ 
                    opacity: isActive ? 1 : 0.6,
                    filter: isActive ? 'brightness(1)' : 'brightness(0.7)'
                  }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.6,
                    filter: isActive ? 'brightness(1)' : 'brightness(0.7)'
                  }}
                  whileHover={{ 
                    opacity: 1,
                    filter: 'brightness(1)',
                    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                  }}
                  transition={{ 
                    opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                    filter: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                  }}
                >
                  {item.label}
                  
                  {/* Gradient overlay for active state */}
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 text-transparent bg-clip-text name-gradient"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.span>
              </Link>
            </li>
          )
        })}
      </ul>
    </motion.nav>
  )
}