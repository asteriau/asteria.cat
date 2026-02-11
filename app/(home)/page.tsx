// app/(home)/page.tsx
import LastFm from "@/components/home/LastFm";
import Card from "@/components/ui/Card";
import CurrentTime from "@/components/time/CurrentTime";
import ProfileCard from "@/components/home/ProfileCard";

export default function Page() {
  return (
    <div className="h-full md:col-span-5 md:row-span-3 flex flex-col md:grid md:grid-cols-5 gap-4 items-left justify-center animate-page-in">
      {/* "Who am I?" card - only text fades in */}
      <Card className="max-w-full max-h-full w-screen dark:text-neutral-300 text-neutral-700 md:col-span-5 md:row-span-2">
        <div className="text-xl mb-1 font-semibold text-wisteria-900 dark:text-wisteria-200 opacity-0 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
          Who am I?
        </div>
        <p className="mb-2 leading-snug opacity-0 animate-[fadeIn_0.5s_ease-out_0.35s_forwards]">
          I'm a jack-of-all-trades who mostly does web and software development on the side. <br></br>
          In my free time, I like to make fast things to solve cool problems.
        </p>
        <p className="leading-snug opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]">
          Outside of coding, I spend my time listening to music, reading, bedrotting, or bricking my pc. <br></br> 
          You'll often find me working on something, listening to music, or hanging out with friends.
        </p>
      </Card>

      {/* Last.fm card - let LastFm component handle its own animation */}
      <Card className="text-lg max-w-full py-2 w-screen md:col-span-3 md:row-span-1">
        <LastFm />
      </Card>

      {/* Current time card - let CurrentTime component handle its own animation */}
      <Card className="p-0 text-lg w-screen max-w-full dark:bg-neutral-900/50 flex flex-col justify-center items-center md:col-span-2 md:row-span-1">
        <div className="flex flex-col h-full justify-center items-center text-wisteria-700 dark:text-wisteria-200 text-base">
          <noscript>
            <div className="text-xs text-gray-400">
              You'll need to enable JavaScript to view this.
            </div>
          </noscript>
          <CurrentTime className="text-xl" />
          in Bucuresti, Romania
        </div>
      </Card>
    </div>
  );
}