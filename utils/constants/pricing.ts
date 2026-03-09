export const PLANS = [
  {
    name: 'Free',
    info: 'For individuals and early hiring',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      { text: 'Create interview rooms' },
      { text: 'Up to 5 interviews/month', limit: '5 interviews' },
      { text: 'AI interview assistant' },
      { text: 'Candidate evaluation reports', tooltip: 'Basic AI scoring and feedback' },
      { text: 'Interview recordings', tooltip: 'Up to 5 recordings' },
      { text: 'Community support', tooltip: 'Help from our Discord community' }
    ],
    btn: {
      text: 'Start for free',
      href: '/auth/sign-up?plan=free',
      variant: 'default'
    }
  },
  {
    name: 'Pro',
    info: 'For startups and growing teams',
    price: {
      monthly: 19,
      yearly: Math.round(19 * 12 * (1 - 0.12))
    },
    features: [
      { text: 'Create interview rooms' },
      { text: 'Up to 100 interviews/month', limit: '100 interviews' },
      { text: 'Advanced AI evaluation', tooltip: 'Detailed candidate scoring & insights' },
      { text: 'Interview recordings', tooltip: 'Unlimited recordings' },
      { text: 'Export candidate reports', tooltip: 'Download candidate evaluation reports' },
      { text: 'Team collaboration', tooltip: 'Invite team members to review interviews' },
      { text: 'Priority support', tooltip: '24/7 chat support' }
    ],
    btn: {
      text: 'Get started',
      href: '/auth/sign-up?plan=pro',
      variant: 'purple'
    }
  },
  {
    name: 'Business',
    info: 'For organizations hiring at scale',
    price: {
      monthly: 79,
      yearly: Math.round(79 * 12 * (1 - 0.12))
    },
    features: [
      { text: 'Unlimited interview rooms' },
      { text: 'Unlimited interviews' },
      {
        text: 'Advanced AI evaluation',
        tooltip: 'Deep candidate insights & hiring recommendations'
      },
      { text: 'Unlimited recordings & storage' },
      { text: 'Custom hiring workflows', tooltip: 'Design your own hiring pipeline' },
      { text: 'Team collaboration', tooltip: 'Multiple reviewers & hiring managers' },
      { text: 'Dedicated account manager', tooltip: 'Priority support from our team' }
    ],
    btn: {
      text: 'Contact team',
      href: '/auth/sign-up?plan=business',
      variant: 'default'
    }
  }
];

export const PRICING_FEATURES = [
  {
    text: 'Interview rooms',
    tooltip: 'Create dedicated rooms to conduct interviews'
  },
  {
    text: 'AI candidate evaluation',
    tooltip: 'Automatically analyze candidate responses'
  },
  {
    text: 'Interview recordings',
    tooltip: 'Record and review interview sessions'
  },
  {
    text: 'Candidate reports',
    tooltip: 'Generate structured evaluation reports'
  },
  {
    text: 'Team collaboration',
    tooltip: 'Invite teammates to review candidates'
  },
  {
    text: 'Priority support',
    tooltip: 'Faster help from our support team'
  },
  {
    text: 'AI interview insights',
    tooltip: 'AI-generated feedback and hiring recommendations'
  }
];

export const WORKSPACE_LIMIT = 2;
