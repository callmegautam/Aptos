'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Handshake, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contactOptions = [
  {
    icon: Mail,
    title: 'General & support',
    desc: 'Questions, technical support, or feedback.',
    value: 'support@aptos.example.com',
  },
  {
    icon: Handshake,
    title: 'Partnerships & sales',
    desc: 'Enterprise plans, demos, and custom solutions.',
    value: 'hello@aptos.example.com',
  },
  {
    icon: MessageSquare,
    title: 'Demo & onboarding',
    desc: 'Schedule a walkthrough or get help getting started.',
    value: '',
    cta: 'Schedule a demo',
    ctaHref: '#contact-form',
  },
];

export default function ContactPage() {
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
              <HelpCircle className="size-4" />
              We’re here to help
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Get in{' '}
              <span className="bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                touch
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Have a question, need a demo, or want to talk partnerships? Reach out and we’ll get back to you soon.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 shadow-lg shadow-primary/25">
                <Link href="/register">Start free trial</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container px-4">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">Contact options</p>
          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight md:text-3xl">
            How to reach us
          </h2>
          <motion.div
            className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            {contactOptions.map(({ icon: Icon, title, desc, value, cta, ctaHref }) => (
              <motion.div
                key={title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg md:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/80 via-primary to-primary/80 opacity-80" aria-hidden />
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-2 ring-primary/20 transition-colors group-hover:bg-primary/15">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                <p className="mt-4 font-medium text-foreground">
                  {cta && ctaHref ? (
                    <Link href={ctaHref} className="text-primary hover:underline">{cta}</Link>
                  ) : value ? (
                    <a href={`mailto:${value}`} className="text-primary hover:underline">{value}</a>
                  ) : null}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/15 py-16 md:py-20">
        <div className="container px-4">
          <div id="contact-form" className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg md:p-10">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Contact form (coming soon)</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We’re building a form for demos and inquiries. Until then, email us at{' '}
              <a href="mailto:support@aptos.example.com" className="font-medium text-primary hover:underline">
                support@aptos.example.com
              </a>{' '}
              or use the options above.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
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
