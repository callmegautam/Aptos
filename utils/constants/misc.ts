import {
  ClipboardCheckIcon,
  LayoutDashboardIcon,
  PlusIcon,
  VideoIcon,
  WandSparklesIcon
} from 'lucide-react';

export const DEFAULT_AVATAR_URL =
  'https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=';

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
  {
    name: 'Asana',
    logo: '/assets/company-01.svg'
  },
  {
    name: 'Tidal',
    logo: '/assets/company-02.svg'
  },
  {
    name: 'Innovaccer',
    logo: '/assets/company-03.svg'
  },
  {
    name: 'Linear',
    logo: '/assets/company-04.svg'
  },
  {
    name: 'Raycast',
    logo: '/assets/company-05.svg'
  },
  {
    name: 'Labelbox',
    logo: '/assets/company-06.svg'
  }
] as const;
export const PROCESS = [
  {
    title: 'Create Interview Rooms',
    description: 'Set up structured interview sessions and invite candidates with a single link.',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Conduct Smart Interviews',
    description: 'Run interviews with AI-assisted questions, recordings, and real-time insights.',
    icon: VideoIcon
  },
  {
    title: 'Evaluate Candidates Instantly',
    description: 'Review AI-generated reports, candidate scores, and hiring recommendations.',
    icon: ClipboardCheckIcon
  }
] as const;

// export const FEATURES = [
//   {
//     title: 'Interview rooms',
//     description: 'Create dedicated rooms to conduct structured interviews with candidates.'
//   },
//   {
//     title: 'AI candidate evaluation',
//     description: 'Automatically analyze candidate responses and generate structured feedback.'
//   },
//   {
//     title: 'Interview recordings',
//     description: 'Record interviews so hiring teams can review candidates anytime.'
//   },
//   {
//     title: 'Candidate scorecards',
//     description: 'Get AI-powered scoring based on communication, knowledge, and confidence.'
//   },
//   {
//     title: 'Custom interview workflows',
//     description: 'Design your own interview stages and evaluation process.'
//   },
//   {
//     title: 'Team collaboration',
//     description: 'Invite teammates to review interviews and share feedback before making decisions.'
//   }
// ] as const;

export const REVIEWS = [
  {
    name: 'Michael Smith',
    username: '@michaelsmith',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    review:
      'This platform completely transformed our hiring process. The AI evaluation helps us quickly identify the best candidates.'
  },
  {
    name: 'Emily Johnson',
    username: '@emilyjohnson',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    rating: 4,
    review:
      'Scheduling interviews and reviewing candidate recordings has never been easier. A huge time saver for our team.'
  },
  {
    name: 'Daniel Williams',
    username: '@danielwilliams',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    rating: 5,
    review:
      'The AI insights are incredibly helpful. We can evaluate candidates objectively and make faster hiring decisions.'
  },
  {
    name: 'Sophia Brown',
    username: '@sophiabrown',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    rating: 4,
    review:
      'A fantastic tool for managing interviews. The recordings and candidate reports are extremely useful.'
  },
  {
    name: 'James Taylor',
    username: '@jamestaylor',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    rating: 5,
    review:
      'We reduced our hiring time significantly after switching to this platform. Highly recommended for growing teams.'
  },
  {
    name: 'Olivia Martinez',
    username: '@oliviamartinez',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    rating: 4,
    review:
      'Very intuitive and powerful. The AI-generated candidate summaries make it easy to compare applicants.'
  },
  {
    name: 'William Garcia',
    username: '@williamgarcia',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    rating: 5,
    review:
      'This platform is a game changer for hiring. The evaluation reports help us make confident decisions.'
  },
  {
    name: 'Mia Rodriguez',
    username: '@miarodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    rating: 4,
    review:
      'A simple yet powerful solution for running structured interviews and collaborating with our hiring team.'
  },
  {
    name: 'Henry Lee',
    username: '@henrylee',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    rating: 5,
    review:
      'The best interview platform we’ve used so far. AI insights and recordings make evaluating candidates effortless.'
  }
] as const;
