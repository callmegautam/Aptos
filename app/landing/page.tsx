'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Video, Info, Mail, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  {
    icon: Video,
    title: 'Features',
    desc: 'Explore AI video interviews, avatar-led conversations, admissions screening, and mock interviews.',
    href: '/landing/features',
    label: 'See features',
  },
  {
    icon: Info,
    title: 'About',
    desc: 'Learn about our mission, values, and how we help teams hire fairly at scale.',
    href: '/landing/about',
    label: 'About us',
  },
  {
    icon: Mail,
    title: 'Contact',
    desc: 'Get in touch for support, demos, partnerships, or enterprise inquiries.',
    href: '/landing/contact',
    label: 'Contact us',
  },
  {
    icon: CreditCard,
    title: 'Pricing',
    desc: 'Simple plans for every team. Start free, upgrade when you’re ready.',
    href: '/landing/pricing',
    label: 'View pricing',
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,black_60%,transparent_100%)] opacity-15"
        aria-hidden
      />

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
              Explore Aptos
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Your AI interview{' '}
              <span className="bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                platform
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Everything you need to run fair, scalable video interviews—features, pricing, and how to get started.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 shadow-lg shadow-primary/25">
                <Link href="/">Go to home</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-2 px-8">
                <Link href="/register">Start free trial</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container px-4">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">Quick links</p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Explore more
          </h2>
          <motion.div
            className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            {sections.map(({ icon: Icon, title, desc, href, label }) => (
              <motion.div
                key={title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link href={href} className="group block h-full">
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg md:p-8">
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/80 via-primary to-primary/80 opacity-80" aria-hidden />
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-2 ring-primary/20 transition-colors group-hover:bg-primary/15">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-muted-foreground">{desc}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3">
                      {label}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border/50 py-16 md:py-20">
        <div className="container px-4">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-primary/25 bg-linear-to-br from-primary/10 via-transparent to-primary/5 p-8 text-center md:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" aria-hidden />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ready to get started?</h2>
            <p className="mt-3 text-muted-foreground">
              Start with a free trial or schedule a demo to see Aptos in action.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 rounded-xl px-8">
                <Link href="/register">Start free trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-8">
                <Link href="/landing/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
