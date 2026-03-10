import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import {
  ArrowRightIcon,
  BarChart3Icon,
  CalendarIcon,
  FolderOpenIcon,
  SearchIcon,
  VideoIcon,
  WandSparklesIcon,
  WaypointsIcon
} from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Integrations } from '@/components/ui/integrations';
import { Label } from './label';

// export const CARDS = [
//   {
//     Icon: Link2Icon,
//     name: 'Shorten links',
//     description: 'Create short links that are easy to remember and share.',
//     href: '#',
//     cta: 'Learn more',
//     className: 'col-span-3 lg:col-span-1',
//     background: (
//       <Card className="absolute top-10 left-10 origin-top rounded-none rounded-tl-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105 border border-border border-r-0">
//         <CardHeader>
//           <CardTitle>Create short links</CardTitle>
//           <CardDescription>Create short links that are easy to remember and share.</CardDescription>
//         </CardHeader>
//         <CardContent className="-mt-4">
//           <Label>Paste your link</Label>
//           <Input
//             type="text"
//             placeholder="Paste your link here..."
//             className="w-full focus-visible:ring-0 focus-visible:ring-transparent"
//           />
//         </CardContent>
//       </Card>
//     )
//   },
//   {
//     Icon: SearchIcon,
//     name: 'Search your links',
//     description: 'Quickly find the links you need with AI-powered search.',
//     href: '#',
//     cta: 'Learn more',
//     className: 'col-span-3 lg:col-span-2',
//     background: (
//       <Command className="absolute right-10 top-10 w-[70%] origin-to translate-x-0 border border-border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-2">
//         <Input placeholder="Type to search..." />
//         <div className="mt-1 cursor-pointer">
//           <div className="px-4 py-2 hover:bg-muted rounded-md">linkify.io/hdf00c</div>
//           <div className="px-4 py-2 hover:bg-muted rounded-md">linkify.io/sdv0n0</div>
//           <div className="px-4 py-2 hover:bg-muted rounded-md">linkify.io/03gndo</div>
//           <div className="px-4 py-2 hover:bg-muted rounded-md">linkify.io/09vmmw</div>
//           <div className="px-4 py-2 hover:bg-muted rounded-md">linkify.io/s09vws</div>
//           <div className="px-4 py-2 hover:bg-muted rounded-md">linkify.io/sd8fv5</div>
//         </div>
//       </Command>
//     )
//   },
//   {
//     Icon: WaypointsIcon,
//     name: 'Connect your apps',
//     description: 'Integrate with your favorite apps and services.',
//     href: '#',
//     cta: 'Learn more',
//     className: 'col-span-3 lg:col-span-2 max-w-full overflow-hidden',
//     background: (
//       <Integrations className="absolute right-2 pl-28 md:pl-0 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
//     )
//   },
//   {
//     Icon: CalendarIcon,
//     name: 'Calendar',
//     description: 'Keep track of your links with our calendar view.',
//     className: 'col-span-3 lg:col-span-1',
//     href: '#',
//     cta: 'Learn more',
//     background: (
//       <Calendar
//         mode="single"
//         selected={new Date(2022, 4, 11, 0, 0, 0)}
//         className="absolute right-0 top-10 origin-top rounded-md border border-border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
//       />
//     )
//   }
// ];

export const CARDS = [
  {
    Icon: FolderOpenIcon,
    name: 'Create Interview Rooms',
    description: 'Set up structured interview sessions and invite candidates with a single link.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <Card className="absolute top-10 left-10 origin-top rounded-none rounded-tl-md transition-all duration-300 ease-out mask-[linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105 border border-border border-r-0">
        <CardHeader>
          <CardTitle>Create Interview Room</CardTitle>
          <CardDescription>
            Start a new interview session and share the invite link.
          </CardDescription>
        </CardHeader>
        <CardContent className="-mt-4">
          <Label>Interview Title</Label>
          <Input
            type="text"
            placeholder="Frontend Developer Interview"
            className="w-full focus-visible:ring-0 focus-visible:ring-transparent"
          />
        </CardContent>
      </Card>
    )
  },
  {
    Icon: SearchIcon,
    name: 'Search Candidates',
    description: 'Quickly find candidates, interview sessions, and evaluation reports.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <Command className="absolute right-10 top-10 w-[70%] origin-to translate-x-0 border border-border transition-all duration-300 ease-out mask-[linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-2">
        <Input placeholder="Search candidates..." />
        <div className="mt-1 cursor-pointer">
          <div className="px-4 py-2 hover:bg-muted rounded-md">Rahul Sharma — Frontend</div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">Priya Patel — Backend</div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">Amit Verma — DevOps</div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">Sneha Shah — UI Designer</div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">Arjun Mehta — Fullstack</div>
        </div>
      </Command>
    )
  },
  // {
  //   Icon: VideoIcon,
  //   name: 'Live Interview Sessions',
  //   description: 'Conduct real-time interviews with built-in AI analysis and recording.',
  //   href: '#',
  //   cta: 'Learn more',
  //   className: 'col-span-3 lg:col-span-2',
  //   background: (
  //     <Card className="absolute right-10 top-10 w-[70%] origin-to translate-x-0 border border-border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-2">
  //       <CardHeader>
  //         <CardTitle>Live Interview Session</CardTitle>
  //       </CardHeader>
  //       <CardContent></CardContent>
  //     </Card>

  //     // <Command className="absolute right-10 top-10 w-[70%] origin-to translate-x-0 border border-border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-2">
  //     //   <div className="px-4 py-2 text-sm text-muted-foreground">Interview Session</div>

  //     //   <div className="mt-1">
  //     //     <div className="px-4 py-2 hover:bg-muted rounded-md">Candidate joined</div>
  //     //     <div className="px-4 py-2 hover:bg-muted rounded-md">AI generating next question...</div>
  //     //     <div className="px-4 py-2 hover:bg-muted rounded-md">Recording in progress</div>
  //     //     <div className="px-4 py-2 hover:bg-muted rounded-md">AI analyzing response</div>
  //     //   </div>
  //     // </Command>
  //   )
  // },

  {
    Icon: WandSparklesIcon,
    name: 'AI Candidate Evaluation',
    description: 'Automatically analyze interview responses and generate candidate insights.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2 max-w-full overflow-hidden',
    background: (
      <div className="absolute right-2 pl-28 md:pl-0 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out mask-[linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105 p-6">
        <div className="rounded-lg border border-border p-4 space-y-2">
          <p className="text-sm font-medium">Candidate Score</p>
          <p className="text-3xl font-bold">8.7 / 10</p>
          <p className="text-xs text-muted-foreground">
            Strong communication, solid problem solving, recommended for next round.
          </p>
        </div>
      </div>
    )
  },
  {
    Icon: CalendarIcon,
    name: 'Schedule Interviews',
    description: 'Plan and manage interview sessions with built-in scheduling.',
    className: 'col-span-3 lg:col-span-1',
    href: '#',
    cta: 'Learn more',
    background: (
      <Calendar
        mode="single"
        selected={new Date(2024, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top rounded-md border border-border transition-all duration-300 ease-out mask-[linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
      />
    )
  }
];

const BentoGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn('grid w-full auto-rows-[22rem] grid-cols-3 gap-4', className)}>
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      'group relative col-span-3 flex flex-col justify-between border border-border/60 overflow-hidden rounded-xl',
      'bg-black [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      className
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-neutral-300">{name}</h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    <div
      className={cn(
        'absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'
      )}
    >
      {/* <Link
        href={href}
        className={buttonVariants({ size: 'sm', variant: 'ghost', className: 'cursor-pointer' })}
      >
        {cta}
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </Link> */}
    </div>
    <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/3 group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
