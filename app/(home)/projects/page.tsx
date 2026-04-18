import Card from "@/components/ui/Card";
import { FaGithub } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { LuLink } from "react-icons/lu";

interface ProjectCardLink {
  link: string;
  LinkIcon?: IconType;
  linkText?: string;
}

interface ProjectData {
  title: string;
  subtitle: string;
  description: string;
  links: ProjectCardLink[];
  githubRepo?: string;
}

const PROJECTS: ProjectData[] = [
  {
    title: "asteria.cat",
    subtitle: "My poorly made blog",
    description: "A fast, minimal, MDX-based blog and homepage.\nThis site!",
    links: [
      { link: "https://github.com/asteriau/asteria.cat", linkText: "GitHub", LinkIcon: FaGithub },
    ],
    githubRepo: "asteriau/asteria.cat",
  },
  {
    title: "dotfiles",
    subtitle: "Hell on earth",
    description: "My NixOS flake using Home Manager and flake-parts. \ni use quickshell btw",
    links: [
      { link: "https://github.com/asteriau/dotfiles", linkText: "GitHub", LinkIcon: FaGithub },
    ],
    githubRepo: "asteriau/dotfiles",
  },
  {
    title: "whimsy",
    subtitle: "No one's favorite home page",
    description: "A minimal & hackable startpage i made on a whim. \nPun intended",
    links: [
      { link: "https://github.com/asteriau/whimsy", linkText: "GitHub", LinkIcon: FaGithub },
    ],
    githubRepo: "asteriau/whimsy",
  },
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Nix: "#7e7eff",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Shell: "#89e051",
  Lua: "#000080",
  Ruby: "#701516",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Svelte: "#ff3e00",
  Vue: "#41b883",
  Astro: "#ff5a03",
  Markdown: "#083fa1",
};

async function fetchPrimaryLanguage(repo: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.language ?? null;
  } catch {
    return null;
  }
}

const STAGGER_MS = 60;

export default async function Projects() {
  const languages = await Promise.all(
    PROJECTS.map((p) => (p.githubRepo ? fetchPrimaryLanguage(p.githubRepo) : Promise.resolve(null)))
  );

  return (
    <div className="h-full w-full md:col-span-5 md:row-span-4 flex flex-col items-left justify-center md:grid md:grid-cols-4 md:grid-rows-4 gap-4 animate-page-in">
      {PROJECTS.map((project, i) => (
        <div
          key={project.title}
          className="animate-stagger-in md:col-span-2 flex flex-col h-full min-h-0"
          style={{ animationDelay: `${i * STAGGER_MS}ms` }}
        >
          <ProjectCard {...project} language={languages[i]} />
        </div>
      ))}
    </div>
  );
}

function LanguageDot({ language }: { language: string | null }) {
  if (!language) return null;
  const color = LANGUAGE_COLORS[language] ?? "#8b8b8b";
  return (
    <span className="flex items-center gap-1.5 text-xs text-neutral-400">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {language}
    </span>
  );
}

function ProjectCard({
  title,
  subtitle,
  description,
  links,
  language,
}: ProjectData & { language: string | null }) {
  return (
    <Card className="w-full h-full min-h-0 flex flex-col justify-between gap-3">
      <div>
        <div className="flex flex-row items-start justify-between gap-2">
          <div>
            <div className="text-base font-medium text-neutral-100">{title}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{subtitle}</div>
          </div>
          <LanguageDot language={language} />
        </div>
        <div className="text-sm text-neutral-300 mt-3 space-y-0.5">
          {description.split("\n").map((line, i) => (
            <div key={i + line}>{line}</div>
          ))}
        </div>
      </div>
      <div className="text-sm text-paradise-300">
        {links.map((link, i) => {
          const LinkIcon = link.LinkIcon ?? LuLink;
          return (
            <a
              href={link.link}
              target="_blank"
              className="pr-4 align-text-bottom hover:text-paradise-200 transition-colors duration-200"
              key={i + link.link}
            >
              <LinkIcon className="inline mb-1 mr-1" />{" "}
              {link.linkText ? link.linkText : link.link}
            </a>
          );
        })}
      </div>
    </Card>
  );
}
