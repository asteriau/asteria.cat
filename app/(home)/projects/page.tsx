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
  imageUrl?: string;
}

const PROJECTS: ProjectData[] = [
  {
    title: "asteria.cat",
    subtitle: "My poorly made blog",
    description: "A fast, minimal, MDX-based blog and homepage.\nThis site!",
    links: [
      { link: "https://github.com/asteriau/asteria.cat", linkText: "GitHub", LinkIcon: FaGithub },
    ],
  },
  {
    title: "dotfiles",
    subtitle: "Hell on earth",
    description: "My NixOS flake using Home Manager and flake-parts. \ni use quickshell btw",
    links: [
      { link: "https://github.com/asteriau/dotfiles", linkText: "GitHub", LinkIcon: FaGithub },
    ],
  },
  {
    title: "whimsy",
    subtitle: "No one's favorite home page",
    description: "A minimal & hackable startpage i made on a whim. \nPun intended",
    links: [
      { link: "https://github.com/asteriau/dotfiles", linkText: "GitHub", LinkIcon: FaGithub },
    ],
  },
];

const STAGGER_MS = 60;

export default function Projects() {
  return (
    <div className="h-full w-screen max-w-full md:col-span-5 md:row-span-4 flex flex-col items-left justify-center md:grid md:grid-cols-4 md:grid-rows-4 gap-4 animate-page-in">
      {PROJECTS.map((project, i) => (
        <div
          key={project.title}
          className="animate-stagger-in md:col-span-2 flex flex-col h-full min-h-0"
          style={{ animationDelay: `${i * STAGGER_MS}ms` }}
        >
          <ProjectCard {...project} />
        </div>
      ))}
    </div>
  );
}

function ProjectCard({
  imageUrl,
  title,
  subtitle,
  description,
  links,
}: ProjectData) {
  return (
    <Card className="text-lg w-screen max-w-full h-full min-h-0 dark:bg-neutral-900/10 flex flex-col items-left justify-between md:col-span-2">
      <div className="flex flex-row h-min justify-left gap-2">
        {imageUrl && (
          <img
            src="/tinies.webp"
            alt="{title} logo"
            className="w-16 h-16 rounded-lg"
          />
        )}
        <div className="flex flex-col items-left justify-center">
          <div className="text-xl">{title}</div>
          <div className="text-sm dark:text-neutral-400 text-neutral-700">
            {subtitle}
          </div>
        </div>
      </div>
      <div className="text-base h-full mt-2">
        {description.split("\n").map((line, i) => (
          <div className="mb-1" key={i + line}>
            {line}
          </div>
        ))}
      </div>
      <div>
        <div className="text-sm dark:text-wisteria-400 text-wisteria-700 -mb-2 mt-1">
          {links.map((link, i) => {
            const LinkIcon = link.LinkIcon ?? LuLink;
            return (
              <a
                href={link.link}
                target="_blank"
                className="pr-4 align-text-bottom"
                key={i + link.link}
              >
                <LinkIcon className="inline mb-1 mr-1 text-lg" />{" "}
                {link.linkText ? link.linkText : link.link}
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
