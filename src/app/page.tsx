'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Cirno } from '@/components/visual/Cirno'
import { Button } from '@/components/ui/Button'
import { heroContainer, heroTitle, heroText, heroButton, heroModel } from '@/lib/animations'

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <motion.section
      className="section text-fg overflow-x-hidden"
      initial="hidden"
      animate="show"
      variants={heroContainer}
    >
      <div
        ref={containerRef}
        className="hero-wrapper min-h-screen flex justify-center items-center relative p-6 md:p-8"
      >

        <div className="hero-container w-full max-w-[1200px] mx-auto flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-16 items-center justify-center">
          
          {/* Hero Text */}
          <motion.div
            className="hero-content flex flex-col items-center md:items-start text-center md:text-left gap-6 md:gap-8"
            variants={heroTitle}
          >
            <motion.h1
              className="hero-title text-[clamp(3.5rem,9vw,6rem)] font-[350] tracking-[-2px] leading-[1.05] m-0 text-accent"
              style={{ textShadow: 'var(--text-shadow)' }}
              variants={heroTitle}
            >
              hi, i&apos;m <span className="asteria">asteria</span>!
            </motion.h1>

            <motion.p
              className="hero-summary max-w-full md:max-w-[600px] text-[clamp(1.15rem,2.2vw,1.65rem)] leading-[1.6] font-light opacity-75 m-0 pl-3 md:pl-0 border-l-2 border-[rgba(141,163,185,0.25)] md:border-none"
              variants={heroText}
            >
              i build elegant, atmospheric interfaces with a focus on minimalism, motion,
              and immersive user experience.
            </motion.p>

            <motion.div className="mt-2" variants={heroButton}>
              <Link href="/about">
                <Button className="bg-elevated border border-border text-fg">
                  <span>about me</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path
                      d="M12 5L19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="model-wrapper w-full flex justify-center mt-8 md:mt-0"
            variants={heroModel}
          >
            <Cirno
              modelUrl="/models/cirno.glb"
              scale={1}
              rotationSpeed={1.25}
              floatHeight={0.05}
              floatSpeed={2}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
