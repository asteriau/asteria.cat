'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SOCIAL_LINKS } from '@/lib/constants'
import {
  pageContainer,
  listContainer,
  listItem
} from '@/lib/animations'

export default function ContactPage() {
  return (
    <motion.section
      className="section flex flex-1 flex-col items-center py-10 md:py-14"
      initial="hidden"
      animate="show"
      variants={pageContainer}
    >
      <div className="w-full max-w-[800px] px-5 md:px-6">
        <SectionHeader
          title="contact"
          subtitle="best ways to reach me, and places I exist online"
          as="h1"
          size="lg"
          align="center"
          variant="gradient"
        />

        <motion.div
          className="mt-6"
          variants={listContainer}
        >
          <motion.div
            className="contact-grid grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
            variants={listContainer}
          >
            {SOCIAL_LINKS.map((link) => (
              <motion.div key={link.name} variants={listItem}>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full group"
                >
                  <Card
                    variant="contact"
                    className="
                      p-5 md:p-6 
                      flex items-center gap-4 
                      min-h-[85px] 
                      bg-bg/30 
                      hover:bg-bg/40
                      transition-all duration-300
                      border border-transparent
                      hover:border-border/20
                      group-hover:scale-[1.02]
                      group-hover:shadow-xl
                    "
                  >

                    <div className="
                      flex-shrink-0 
                      w-12 h-12 
                      flex items-center justify-center
                      rounded-lg
                      transition-all duration-300
                    ">
                      <Image
                        src={link.icon}
                        alt=""
                        width={24}
                        height={24}
                      />
                    </div>

                    <div className="flex flex-col justify-center items-start h-full flex-1 min-w-0">
                      <span className="
                        text-base 
                        font-medium 
                        text-fg 
                        leading-tight 
                        tracking-tight 
                        truncate w-full
                        group-hover:text-accent
                        transition-colors duration-300
                      ">
                        {link.name}
                      </span>
                      <span className="
                        mt-1 
                        text-sm 
                        font-light 
                        text-fg/50
                        leading-tight 
                        tracking-[0.02em] 
                        truncate w-full
                        group-hover:opacity-90
                        transition-opacity duration-300
                      ">
                        {link.handle}
                      </span>
                    </div>

                    <motion.div
                      className="
                        opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                        -translate-x-0 sm:-translate-x-2
                        transition-all duration-300
                      "
                      animate={{ x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        className="text-accent/60"
                      >
                        <path 
                          d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            className="
              text-center 
              mt-10 
              text-sm 
              text-fg/50 
              font-light 
              tracking-[0.02em]
              max-w-md 
              mx-auto
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Feel free to reach out for collabs, questions, or just to say hi!
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  )
}
