import TimeAgo from "@/components/time/TimeAgo";
import Card from "@/components/ui/Card";
import { LuClock } from "react-icons/lu";

export default function UsesPage() {
  return (
    <div className="h-full w-screen max-w-full md:col-span-5 md:row-span-4 flex flex-col items-left justify-center md:grid md:grid-cols-2 gap-4 pb-16 animate-page-in">
      <Card className="text-lg w-screen max-w-full bg-[#1E1E1E]/10 flex flex-col items-left justify-between md:col-span-2">
        <div className="p-4">
          <h1 className="text-4xl">/uses</h1>

          <div className="mt-2 text-sm text-neutral-300">
            Inspired by{" "}
            <a
              href="https://wesbos.com/uses"
              target="_blank"
              rel="noopener noreferrer"
              className="a"
            >
              Wes Bos&apos; /uses
            </a>
            . Find more{" "}
            <a
              href="https://uses.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="a"
            >
              /uses here
            </a>
            .
          </div>

          <div className="mt-2 text-sm text-neutral-300">
            <LuClock className="inline-block w-5 h-5 mr-2 mb-1" />
            <span>
              Last updated <TimeAgo date="2026-01-30" parentheses={false} />
            </span>
          </div>

          <div className="text-base mt-3">
            <p>
              I use a variety of tools and services to make my life easier. I&apos;m
              always looking for new ways to improve my workflow, so if you have
              any suggestions or recommendations, please let me know!
            </p>
            <p className="mt-2">
              Anyway, this should be a pretty good list of the tools I use for
              the few people who wanted it.
            </p>
          </div>

          {/* Linux */}
          <div className="my-6 h-px bg-paradise-300/10" />

          <h2 className="text-2xl mt-4 tracking-tight">Linux</h2>
          <ul className="space-y-2 list-disc list-outside ml-4 text-neutral-200 mt-2 text-base">
            <li>
              I use{" "}
              <a
                href="https://nixos.org"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                NixOS
              </a>{" "}
              on my desktop because I hate managing dependencies.
            </li>
            <li>
              My daily driver WM is currently{" "}
              <a
                href="https://hyprland.org"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Hyprland
              </a>{" "}
              (though{" "}
              <a
                href="https://github.com/YaLTeR/niri"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Niri
              </a>{" "}
              looks interesting).
            </li>
            <li>
              I build all my widgets using{" "}
              <a
                href="https://github.com/quickshell-mirror/quickshell"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Quickshell
              </a>
              .
            </li>
          </ul>

          {/* Editor + Terminal */}
          <div className="my-6 h-px bg-paradise-300/10" />

          <h2 className="text-2xl mt-4 tracking-tight">Editor + Terminal</h2>
          <ul className="space-y-2 list-disc list-outside ml-4 text-neutral-200 mt-2 text-base">
            <li>
              I commonly use{" "}
              <a
                href="https://code.visualstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                VS Code
              </a>
              , but I&apos;m currently learning to use{" "}
              <a
                href="https://neovim.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Neovim
              </a>{" "}
              because I&apos;m a masochist.
            </li>
            <li>
              I use{" "}
              <a
                href="https://github.com/catppuccin/catppuccin"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Catppuccin
              </a>{" "}
              as my theme everywhere, including some parts of this website.
            </li>
            <li>
              My font of choice is{" "}
              <a
                href="https://www.jetbrains.com/lp/mono/"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                JetBrains Mono
              </a>{" "}
              (or the Nerd Font variant).
            </li>
            <li>
              For my terminal, I mainly use{" "}
              <a
                href="https://codeberg.org/dnkl/foot"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Foot
              </a>
              , but occasionally I may use{" "}
              <a
                href="https://wezfurlong.org/wezterm/"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                WezTerm
              </a>{" "}
              or{" "}
              <a
                href="https://ghostty.example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Ghostty
              </a>
              .
            </li>
            <li>
              In my terminal, I generally use zsh with Starship and Zoxide.
            </li>
          </ul>

          {/* Desktop Apps */}
          <div className="my-6 h-px bg-paradise-300/10" />

          <h2 className="text-2xl mt-4 tracking-tight">Desktop Apps</h2>
          <ul className="space-y-2 list-disc list-outside ml-4 text-neutral-200 mt-2 text-base">
            <li>
              I use{" "}
              <a
                href="https://zen-browser.app"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Zen
              </a>{" "}
              as my browser ever since Firefox became AI slop (though it&apos;s
              still unstable).
            </li>
            <li>
              I use{" "}
              <a
                href="https://vesktop.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Vesktop
              </a>{" "}
              as my Discord client because the official package is awful.
            </li>
            <li>
              I use{" "}
              <a
                href="https://obsidian.md"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Obsidian
              </a>{" "}
              for my personal wiki and note-taking.
            </li>
            <li>
              I use{" "}
              <a
                href="https://www.figma.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Figma
              </a>{" "}
              or{" "}
              <a
                href="https://www.penpot.app"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Penpot
              </a>{" "}
              for my design projects.
            </li>
            <li>
              I use{" "}
              <a
                href="https://github.com/sxyazi/yazi"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Yazi
              </a>{" "}
              as my file manager.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
