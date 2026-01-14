'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { RichPresence } from '@/components/activity/RichPresence'
import { Card } from '@/components/ui/Card'
import {
  pageContainer,
  cardItem,
  divider,
} from '@/lib/animations'

const MotionCard = motion(Card)

export default function AboutPage() {
  return (
    <motion.section
      className="section flex flex-1 flex-col items-center py-10 md:py-14"
      initial="hidden"
      animate="show"
      variants={pageContainer}
    >
      <div className="w-full max-w-[800px] px-5 md:px-6">
        <SectionHeader
          title="about me"
          subtitle="very interesting yup"
          as="h1"
          size="lg"
          variant="gradient"
          align="center"
        />

        <motion.div
          className="
            mt-6
            space-y-3.5
            bg-bg/30
            backdrop-blur-xl
            p-6 md:p-8
            rounded-lg
            text-[0.95rem] md:text-[1rem]
            leading-[1.75]
            text-fg/70
          "
          variants={cardItem}
        >
          <p className="text-fg/85">
            Hi, I&apos;m <span className="name-gradient">asteria</span>! I&apos;m a
            jack-of-all-trades who mostly does web and software development on the side.
          </p>

          <p>
            Currently experimenting with every framework known to man and making silly
            sites like this one.
          </p>

          <p>
            I also really love all kinds of music — especially shoegaze.
          </p>
        </motion.div>

        <motion.div
          className="w-16 h-px bg-border/60 mx-auto my-10 md:my-12"
          variants={divider}
        />

        <SectionHeader
          title="activity"
          subtitle="what i'm up to right now"
          as="h2"
          size="lg"
          variant="gradient"
          align="center"
        />

        <MotionCard
          className="mt-4 p-5 md:p-6 relative overflow-hidden"
          variants={cardItem}
        >
          <RichPresence />
        </MotionCard>
      </div>
    </motion.section>
  )
}
