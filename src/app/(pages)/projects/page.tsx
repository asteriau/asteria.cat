'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { GITHUB_REPOS } from '@/lib/constants'
import { fetchRepository } from '@/lib/api/github'
import { formatUpdated } from '@/lib/utils'
import type { Repository } from '@/types/github'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { pageContainer, listContainer, listItem } from '@/lib/animations'

import colorsData from '@/lib/colors.json'

const colors = colorsData as Record<string, { color: string | null; url?: string }>

function getLanguageColor(language: string | null): string {
  if (!language) return '#ccc'
  return colors[language]?.color ?? '#ccc'
}

export default function ProjectsPage() {
  const [repositories, setRepositories] = useState<Repository[]>([])

  useEffect(() => {
    const loadRepos = async () => {
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
      const results = await Promise.all(
        GITHUB_REPOS.map((url) => fetchRepository(url, token))
      )
      setRepositories(results.filter((repo): repo is Repository => repo !== null))
    }

    loadRepos()
  }, [])

  return (
    <motion.section
      className="section flex flex-1 flex-col items-center py-10 md:py-14"
      initial="hidden"
      animate="show"
      variants={pageContainer}
    >
      <div className="w-full max-w-[1200px] px-5 md:px-6">
        <SectionHeader
          title="projects"
          subtitle="here are some of the projects i've made or contributed to"
          as="h1"
          size="lg"
          align="center"
          variant="gradient"
        />

        <motion.div className="mt-6" variants={listContainer}>
          <motion.div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6" variants={listContainer}>
            {repositories.map((repo) => (
              <motion.div key={repo.id} variants={listItem}>
                <Link
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${repo.full_name} on GitHub`}
                  className="no-underline text-inherit block h-full group"
                >
                  <Card
                    variant="project"
                    className="
                      p-5 md:p-6 
                      h-full 
                      flex flex-col 
                      bg-bg/30 
                      hover:bg-bg/40
                      border border-transparent
                      hover:border-border/20
                      group-hover:scale-[1.02]
                      group-hover:shadow-xl
                      transition-all duration-300
                      min-h-[160px]
                    "
                  >
                    <header className="project-header flex items-center gap-3 mb-4 relative">
                      <div
                        className="
                          relative 
                          w-8 h-8 
                          flex-shrink-0
                          rounded-full 
                          overflow-hidden
                          border border-border/50
                          group-hover:border-accent/30
                          transition-colors duration-300
                        "
                      >
                        <Image
                          src={`${repo.owner.avatar_url}?s=64`}
                          alt={repo.owner.login}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>

                      <div className="project-name flex gap-1.5 text-base leading-tight min-w-0 flex-1">
                        <span className="opacity-65 truncate group-hover:opacity-80 transition-opacity duration-300">
                          {repo.owner.login}
                        </span>
                        <span className="opacity-45 flex-shrink-0">/</span>
                        <span className="text-accent font-medium truncate group-hover:text-accent/90 transition-colors duration-300">
                          {repo.name}
                        </span>
                      </div>

                      <span className="
                        absolute 
                        right-0 
                        top-0.5 
                        opacity-35 
                        flex-shrink-0
                        transition-transform duration-300
                        group-hover:translate-x-1
                        group-hover:rotate-12
                        group-hover:opacity-70
                      ">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <path d="M15 3h6v6" />
                          <path d="M10 14 21 3" />
                        </svg>
                      </span>
                    </header>

                    <p className="
                      project-description 
                      text-[0.95rem] 
                      leading-relaxed 
                      opacity-70 
                      mb-2
                      text-left 
                      line-clamp-2 
                      flex-1
                      group-hover:opacity-85
                      transition-opacity duration-300
                    ">
                      {repo.description || 'No description provided'}
                    </p>

                    <footer className="
                      project-stats 
                      flex 
                      justify-between 
                      items-center 
                      text-sm 
                      opacity-70 
                      mt-auto
                      group-hover:opacity-90
                      transition-opacity duration-300
                    ">
                      <span className="text-xs opacity-60 tracking-[0.2px]">
                        {formatUpdated(repo.updated_at)}
                      </span>

                      {repo.language && (
                        <div className="
                          language 
                          flex 
                          items-center 
                          gap-2 
                          text-sm
                          group-hover:opacity-100
                          transition-opacity duration-300
                        ">
                          <span
                            className="
                              w-2.5 
                              h-2.5 
                              rounded-full 
                              flex-shrink-0
                              shadow-sm
                            "
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span className="opacity-80 text-xs">
                            {repo.language}
                          </span>
                        </div>
                      )}
                    </footer>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
