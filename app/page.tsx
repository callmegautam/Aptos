'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Video,
  Users,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Scale,
  Languages,
  Zap,
  FileEdit,
  UserPlus,
  ClipboardList,
  Briefcase,
  School,
  UsersRound,
  Plug2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const HERO_IMAGE_LOCAL = '/images/hero-ai-interview.png?v=7';
const HERO_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop';

export default function Home() {
  const [heroImgError, setHeroImgError] = useState(false);
  const heroSrc = heroImgError ? HERO_IMAGE_FALLBACK : HERO_IMAGE_LOCAL;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)] opacity-20"
        aria-hidden
      />

      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 w-full border-b border-border/50 backdrop-blur-md bg-background/40">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-4"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span>Aptos</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/landing/features"
              className="text-medium font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/landing/about"
              className="text-medium font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/landing/contact"
              className="text-medium font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/landing/pricing"
              className="text-medium font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/landing/terms"
              className="text-medium font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="gap-1.5">
                  Sign up as <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/register">Candidate</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Interviewer</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login/admin">Admin</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="default" className="gap-1.5">
                  Log in <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/login">Log in</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login/candidate">Candidate</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login/interviewer">Interviewer</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login/admin">Admin</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero + Intro flow as one block with same background */}
      <section className="bg-background">
        {/* Hero */}
        <div className="container relative px-4 pt-28 pb-8 md:pt-36 md:pb-6">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Loved by hiring teams worldwide
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Your hiring{' '}
              <span className="bg-linear-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                starts here
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground md:text-xl">
              There has never been an AI interview platform like this. Until now.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl px-8 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20"
              >
                <Link href="/landing/contact">Schedule a demo</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-2 px-8 transition-all hover:scale-[1.02]"
              >
                <Link href="/register">Start free trial</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto mt-10 max-w-5xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            {/* Gradient-frame hero: 2px gradient “border” + floating shadow, no animation */}
            <div className="relative p-[2px] rounded-2xl md:rounded-3xl bg-linear-to-br from-primary/60 via-primary/30 to-primary/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.06)]">
              <div className="relative aspect-16/10 overflow-hidden rounded-[calc(1rem-2px)] md:rounded-[calc(1.5rem-2px)] bg-black">
                <Image
                  src={heroSrc}
                  alt="AI interview platform"
                  fill
                  className="object-contain object-center"
                  priority
                  sizes="100vw"
                  onError={() => setHeroImgError(true)}
                  unoptimized
                />
                {/* Static vignette for depth */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[calc(1rem-2px)] md:rounded-[calc(1.5rem-2px)] bg-linear-to-t from-black/50 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Intro - same background, no border */}
        <div className="container relative px-4 pt-14 pb-16 md:pt-16 md:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.5rem]">
              Interviews that{' '}
              <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                transform
              </span>{' '}
              hiring
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Aptos is the end-to-end AI interview platform that helps hiring teams and universities
              run video interviews, screen at scale, and evaluate candidates fairly—with structured,
              explainable AI.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl px-8 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20"
              >
                <Link href="/register">Start free trial</Link>
              </Button>
              <p className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground md:w-auto">
                Are you a candidate?{' '}
                <Link
                  href="/login/candidate"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/10"
                >
                  Try Mock Interviews
                  <span aria-hidden>→</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product cards - distinct section with clear separation */}
      <section className="border-t border-border/60 bg-muted/15 py-20 md:py-24">
        <div className="container px-4">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            One platform. Multiple AI interview experiences
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            From async video interviews to avatar-led conversations and admissions screening.
          </p>
          <motion.div
            className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
            {[
              {
                icon: Video,
                title: 'Video interviews',
                desc: 'Structured, scalable async AI video interviews. Assess communication and readiness consistently.',
                href: '/landing/features',
                label: 'Learn more'
              },
              {
                icon: MessageSquare,
                title: 'AI interviewers',
                desc: 'Conversational, avatar-led interviews. Dynamic follow-up questions. Feels like a live interview.',
                href: '/landing/features',
                label: 'Find out more'
              },
              {
                icon: GraduationCap,
                title: 'University admissions',
                desc: 'Fair, scalable AI video interviews for student admissions. Consistent assessment across applicants.',
                href: '/landing/features',
                label: 'Learn more'
              },
              {
                icon: Users,
                title: 'Mock interviews',
                desc: 'AI-led practice interviews with instant feedback. For students, job seekers, and career switchers.',
                href: '/login/candidate',
                label: 'Explore'
              }
            ].map(({ icon: Icon, title, desc, href, label }) => (
              <motion.div
                key={title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link href={href} className="group block h-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 md:p-7 p-6">
                    {/* Top gradient accent */}
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/80 via-primary to-primary/80 opacity-80"
                      aria-hidden
                    />
                    {/* Icon with glow on hover */}
                    <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-2 ring-primary/10 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:ring-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20">
                      <Icon className="size-6 transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <h3 className="mt-4 shrink-0 text-lg font-semibold">{title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                    <span className="mt-4 inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2 group-hover:underline">
                      {label}
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value blocks - Why AI video interviews */}
      <section className="border-t border-border/50 bg-muted/10 py-20 md:py-24">
        <div className="container px-4">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">
            The benefits
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Why AI video{' '}
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              interviews?
            </span>
          </h2>
          <motion.div
            className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {}
            }}
          >
            {[
              {
                icon: Sparkles,
                title: 'AI-powered, human-centric',
                text: 'Designed to feel natural and conversational while delivering structured, explainable evaluations that decision-makers can trust.'
              },
              {
                icon: Scale,
                title: 'Fair & structured assessments',
                text: 'Every candidate is evaluated using the same criteria—reducing bias and ensuring consistency across interviews and geographies.'
              },
              {
                icon: Languages,
                title: 'Supports 10+ languages',
                text: 'Conduct interviews across regions and time zones with support for multiple languages and international applicant pools.'
              },
              {
                icon: Zap,
                title: 'Reduces time-to-hire and bias',
                text: 'Screen thousands of candidates or applicants simultaneously while reducing manual effort by up to 80%.'
              }
            ].map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="group relative flex gap-5 rounded-2xl border border-border bg-card/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 md:p-8"
              >
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-linear-to-b from-primary/70 to-primary/30 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20 group-hover:ring-primary/30">
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who it's for - horizontal cards with left accent bar (distinct from testimonials & steps) */}
      <section className="border-t border-border/50 bg-background py-20 md:py-24">
        <div className="container px-4">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">
            Who uses Aptos
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Built for teams that{' '}
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              screen at scale
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            For hiring, admissions, or skill development—evaluate people fairly, consistently, and
            efficiently.
          </p>
          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                icon: Briefcase,
                title: 'Hiring teams & businesses',
                items: [
                  'Volume hiring',
                  'Sales & customer-facing roles',
                  'Global hiring',
                  'Skills-based recruitment'
                ]
              },
              {
                icon: School,
                title: 'Universities & education',
                items: [
                  'Admissions interviews',
                  'Career readiness programs',
                  'Mock interview practice',
                  'Employer branding'
                ]
              },
              {
                icon: UsersRound,
                title: 'Recruiting & staffing agencies',
                items: [
                  'Faster candidate shortlisting',
                  'Consistent evaluations across clients',
                  'High-volume screening',
                  'Multi-client workflows'
                ]
              }
            ].map(({ icon: Icon, title, items }) => (
              <div
                key={title}
                className="group relative flex gap-5 rounded-xl border-l-4 border-l-primary bg-muted/30 p-6 transition-all duration-300 hover:bg-muted/50 md:p-8"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-2 ring-primary/20 transition-colors group-hover:ring-primary/40">
                  <Icon className="size-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{title}</h3>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-primary/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - quote-style cards with avatar circles (distinct look) */}
      <section className="border-t border-border/50 bg-muted/20 py-20 md:py-24">
        <div className="container px-4">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">
            Testimonials
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Trusted by businesses{' '}
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Hear from organisations that use Aptos to screen candidates at scale and deliver
            measurable hiring outcomes.
          </p>
          <motion.div
            className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
            {[
              {
                quote:
                  'Aptos has been a game-changer. We use it to screen interested candidates and see their quality before the call. It saves us so much time.',
                name: 'Sarah Chen',
                role: 'Agent on YouTube',
                initials: 'SC'
              },
              {
                quote:
                  'Aptos saved us a lot of time. Candidates take interviews on their schedule and we review when it suits us. It effectively replaces our first round. Highly recommended.',
                name: 'John Doe',
                role: 'Managing Director, Oscalar',
                initials: 'JD'
              },
              {
                quote:
                  "Aptos has steadily improved since we adopted it. The interface is clean and inviting. I've saved many hours weeding out unsuitable candidates.",
                name: 'Andrew Ingkavet',
                role: 'Founder, Musicolor Method',
                initials: 'AI'
              }
            ].map(({ quote, name, role, initials }) => (
              <motion.div
                key={name}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-lg shadow-black/5 transition-shadow hover:shadow-xl md:p-8"
              >
                <div className="text-6xl font-serif leading-none text-primary/20" aria-hidden>
                  &ldquo;
                </div>
                <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {quote}
                </blockquote>
                <footer className="mt-6 flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-sm font-bold text-primary">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </footer>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works - horizontal timeline/stepper (distinct from cards) */}
      <section className="border-t border-border/50 bg-background py-20 md:py-24">
        <div className="container px-4">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">
            Simple process
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
            How to start in{' '}
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              3 steps
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Set up AI interviews, invite candidates or applicants, and review AI-powered insights to
            shortlist faster.
          </p>
          <div className="relative mx-auto mt-16 max-w-4xl">
            {/* Connecting line */}
            <div
              className="absolute left-1/2 top-8 hidden h-0.5 w-full -translate-x-1/2 bg-linear-to-r from-transparent via-primary/50 to-transparent md:block"
              aria-hidden
            />
            <div className="grid gap-10 md:grid-cols-3 md:gap-6">
              {[
                {
                  step: '1',
                  icon: FileEdit,
                  title: 'Create an interview',
                  desc: 'Add job details or generate a JD with AI. Set criteria, pick interview style, and customize scoring.'
                },
                {
                  step: '2',
                  icon: UserPlus,
                  title: 'Invite candidates',
                  desc: 'Share interview links or integrate with ATS. Candidates interview on their schedule. Works on desktop and mobile.'
                },
                {
                  step: '3',
                  icon: ClipboardList,
                  title: 'Review, score & shortlist',
                  desc: 'AI-generated summaries and scoring. Compare candidates objectively. Share feedback with your team.'
                }
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex size-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 shadow-lg shadow-primary/10 transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                    <Icon className="size-8 text-primary" />
                    <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-base font-semibold md:text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations - split: copy + CTA left, list right */}
      <section className="border-t border-border/50 bg-muted/10 py-20 md:py-24">
        <div className="container px-4">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Integrations
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                Fits{' '}
                <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  seamlessly
                </span>{' '}
                into your hiring stack
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Aptos works with the tools you already use—ATS, admissions systems, APIs and
                automation. Launch AI interviews without switching platforms.
              </p>
              <div className="mt-6 md:mt-8">
                <Button
                  asChild
                  size="lg"
                  className="h-11 rounded-xl px-6 shadow-lg shadow-primary/20 hover:shadow-primary/25"
                >
                  <Link href="/landing/contact">Schedule a demo</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
            >
              <div
                className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-primary/30 via-primary/50 to-primary/30 md:left-5"
                aria-hidden
              />
              <ul className="space-y-0">
                {['ATS', 'Admissions', 'APIs', 'HRIS', 'Calendars', 'Automation'].map(
                  (label, i) => (
                    <motion.li
                      key={label}
                      variants={{ hidden: { opacity: 0, x: 16 }, visible: { opacity: 1, x: 0 } }}
                      className="group flex items-center gap-4 py-3 pl-2 md:py-4 md:gap-5 md:pl-0"
                    >
                      <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-card text-primary shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-md group-hover:shadow-primary/20 md:size-9">
                        <Plug2 className="size-4" />
                      </span>
                      <span className="text-sm font-medium text-foreground md:text-base">
                        {label}
                      </span>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/50 bg-muted/10 py-20 md:py-24">
        <div className="container px-4">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-primary/25 bg-card p-8 text-center shadow-2xl shadow-primary/10 md:p-12">
            <div
              className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-90"
              aria-hidden
            />
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Get started
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Ready to{' '}
              <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                transform
              </span>{' '}
              your hiring?
            </h2>
            <p className="mt-3 text-muted-foreground">
              No credit card required. Set up in minutes and see better candidates, faster.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl px-8 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20"
              >
                <Link href="/landing/contact">Schedule a demo</Link>
              </Button>
              <span className="text-sm text-muted-foreground">or</span>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-2 px-8 transition-all hover:scale-[1.02] hover:border-primary/50"
              >
                <Link href="/register">Start free trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aptos. All rights reserved.
          </span>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link
              href="/landing/features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/landing/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/landing/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/landing/terms"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
