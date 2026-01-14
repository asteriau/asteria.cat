'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  as?: 'h1' | 'h2' | 'h3'
  size?: 'lg' | 'md' | 'sm'
  align?: 'left' | 'center'
  variant?: 'default' | 'gradient' | 'accent'
}

const sizes = {
  lg: 'text-[clamp(2.1rem,4.5vw,2.6rem)]',
  md: 'text-[1.75rem]',
  sm: 'text-[1.4rem]',
}

export function SectionHeader({
  label,
  title,
  subtitle,
  as = 'h2',
  size = 'md',
  align = 'left',
  variant = 'default',
}: SectionHeaderProps) {
  const Heading = motion[as]

  const titleVariants = {
    gradient: (
      <span className="section-heading-gradient">
        {title}
      </span>
    ),
    accent: (
      <span className="section-heading-accent">
        {title}
      </span>
    ),
    default: title
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        'relative',
        align === 'center' ? 'text-center' : 'text-left'
      )}
    >
      {/* Background decoration for large titles */}
      {size === 'lg' && align === 'center' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8DA3B9]/[0.03] to-transparent blur-3xl" />
        </div>
      )}

      <div className="relative space-y-2.5">
        {label && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.1, 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="section-label"
          >
            {label}
          </motion.span>
        )}

        <div className="space-y-2.5">
          <Heading
            className={clsx(
              'section-heading',
              sizes[size],
              variant === 'gradient' && 'bg-clip-text text-transparent',
              align === 'center' && 'mx-auto'
            )}
          >
            {titleVariants[variant]}
          </Heading>

          {subtitle && (
            <motion.p
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.02
                  }
                }
              }}
              className={clsx(
                'section-subtext',
                align === 'center' ? 'mx-auto' : '',
                size === 'lg' ? 'max-w-2xl' : 'max-w-xl'
              )}
            >
              {subtitle.split('').map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 6,
                      filter: 'blur(2px)'
                    },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      filter: 'blur(0px)'
                    }
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>
          )}
        </div>
      </div>
    </motion.header>
  )
}