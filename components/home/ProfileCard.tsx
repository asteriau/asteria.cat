import Link from "next/link";
import { PrettyImage } from "@/components/blog/Mdx";
import Card from "@/components/ui/Card";
import {
  FaGithub,
  FaLastfm,
  FaDiscord,
  FaTelegramPlane,
  FaSteam,
} from "react-icons/fa";
import Tooltip from "@/components/ui/Tooltip";

export default function ProfileCard() {
  return (
    <Card className="text-xl md:row-span-3 md:col-span-3 md:p-8">
      <div className="flex flex-col items-start">
        <div className="opacity-0 animate-[fadeIn_0.6s_ease-out_0.1s_forwards]">
          <PrettyImage
            src="/pfp.jpg"
            alt="profile image"
            width="100"
            height="100"
            round={true}
          />
        </div>

        <div
          className="text-2xl mt-2 text-wisteria-700 dark:text-wisteria-200 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]"
        >
          Hey, I'm <span className="font-semibold">Laura.</span>
        </div>

        <div
          className="text-base dark:text-neutral-200 text-neutral-700 opacity-0 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]"
        >
          Software & Web dev. Designer. Human being.
          <br />
          <span className="text-sm dark:text-neutral-300 text-neutral-700">
            insert interesting thing about me (there's none)
          </span>
        </div>

        <div
          className="text-sm dark:text-neutral-300 text-neutral-700 opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards] mb-3"
        >
          inquiries? shoot me an email at contact@asteria.cat
        </div>

        <div className="mt-2 flex gap-4 text-3xl text-neutral-700 dark:text-neutral-400">
          <Tooltip tip="GitHub">
            <Link href="https://github.com/asteriau" target="_blank">
              <FaGithub
                className="hover:text-wisteria-700 dark:hover:text-wisteria-100 transition-colors opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.5s" }}
              />
            </Link>
          </Tooltip>

          <Tooltip tip="Discord">
            <Link href="https://discord.com/users/444582693255249950" target="_blank">
              <FaDiscord
                className="hover:text-wisteria-700 dark:hover:text-wisteria-100 transition-colors opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.55s" }}
              />
            </Link>
          </Tooltip>

          <Tooltip tip="Telegram">
            <Link href="https://t.me/obregia" target="_blank">
              <FaTelegramPlane
                className="hover:text-wisteria-700 dark:hover:text-wisteria-100 transition-colors opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.6s" }}
              />
            </Link>
          </Tooltip>

          <Tooltip tip="Steam">
            <Link href="https://steamcommunity.com/id/asteriau" target="_blank">
              <FaSteam
                className="hover:text-wisteria-700 dark:hover:text-wisteria-100 transition-colors opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.65s" }}
              />
            </Link>
          </Tooltip>

          <Tooltip tip="Last.fm">
            <Link href="https://last.fm/user/asteriau" target="_blank">
              <FaLastfm
                className="hover:text-wisteria-700 dark:hover:text-wisteria-100 transition-colors opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.7s" }}
              />
            </Link>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}
