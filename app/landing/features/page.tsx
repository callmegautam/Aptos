'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Video,
  MessageSquare,
  GraduationCap,
  Users,
  Sparkles,
  Scale,
  Languages,
  Zap,
  Mic2,
  BarChart3,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Video,
    title: 'Video Interviews',
    desc: 'Structured, async AI video interviews. Assess communication and readiness at scale—fairly and consistently.',
    highlights: ['Record & submit on your schedule', 'AI analysis & scoring', 'Shareable with hiring teams'],
  },
  {
    icon: MessageSquare,
    title: 'AI Interviewers',
    desc: 'Avatar-led conversational interviews with dynamic follow-up questions. Feels like a live conversation.',
    highlights: ['Natural dialogue flow', 'Context-aware follow-ups', 'Multi-language support'],
  },
  {
    icon: GraduationCap,
    title: 'University Admissions',
    desc: 'Fair, scalable AI video interviews for student admissions. Consistent assessment across applicants.',
    highlights: ['Admissions workflows', 'Rubric-based evaluation', 'High-volume screening'],
  },
  {
    icon: Users,
    title: 'Mock Interviews',
    desc: 'Practice interviews with instant AI feedback. For students, job seekers, and career switchers.',
    highlights: ['Real-time feedback', 'Practice until ready', 'Track improvement'],
  },
];

const capabilities = [
  { icon: Mic2, label: 'Multi-format interviews' },
  { icon: BarChart3, label: 'AI analytics & insights' },
  { icon: Shield, label: 'Enterprise security' },
  { icon: Clock, label: 'Async scheduling' },
];

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Background treatments */}
      <div
        className="pointer-events-none fixed inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,black_60%,transparent_100%)] opacity-15"
        aria-hidden
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 opacity-80" aria-hidden />
        <div className="container relative px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Platform capabilities
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Features that{' '}
              <span className="bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                power hiring
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              From async video interviews to AI-led conversations, Aptos gives you everything to screen candidates
              fairly, consistently, and at scale.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 shadow-lg shadow-primary/25">
                <Link href="/landing/contact">Schedule a demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-2 px-8">
                <Link href="/register">Start free trial</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capability pills - quick scan */}
      <section className="border-b border-border/50 py-8">
        <div className="container px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {capabilities.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <Icon className="size-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main feature grid - distinctive cards */}
      <section className="py-20 md:py-28">
        <div className="container px-4">
          <motion.div
            className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            {features.map(({ icon: Icon, title, desc, highlights }) => (
              <motion.div
                key={title}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary/80 via-primary to-primary/80 opacity-90" aria-hidden />
                <div className="relative p-6 md:p-8">
                  <div className="relative flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-2 ring-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/20 group-hover:ring-primary/40">
                    <Icon className="size-7" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
                  <p className="mt-3 text-muted-foreground">{desc}</p>
                  <ul className="mt-6 space-y-3">
                    {highlights.map((h) => (
                      <li key={h} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="size-5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Aptos - value props */}
      <section className="border-t border-border/50 bg-muted/15 py-20 md:py-24">
        <div className="container px-4">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">
            Why Aptos
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Built for fairness,{' '}
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              scale & speed
            </span>
          </h2>
          <motion.div
            className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {},
            }}
          >
            {[
              { icon: Scale, title: 'Fair & structured', text: 'Same criteria for every candidate. Bias-aware evaluation across geographies.' },
              { icon: Languages, title: '10+ languages', text: 'Interview across regions and time zones with multilingual support.' },
              { icon: Zap, title: '80% less effort', text: 'Screen thousands of candidates while cutting manual review time.' },
            ].map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="flex gap-4 rounded-xl border border-border/80 bg-background/80 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 py-16 md:py-20">
        <div className="container px-4">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-primary/25 bg-linear-to-br from-primary/10 via-transparent to-primary/5 p-8 text-center md:p-10">
            <div
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"
              aria-hidden
            />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ready to transform your hiring?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start with a free trial or schedule a demo to see Aptos in action.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 rounded-xl px-8">
                <Link href="/register">Start free trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-8">
                <Link href="/">← Back to home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
