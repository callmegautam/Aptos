'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    icon: Sparkles,
    name: 'Free',
    tagline: 'Try Aptos at no cost',
    price: '$0',
    period: 'forever',
    desc: 'Get started with core features. Perfect for small teams and trials.',
    features: [
      'Up to 10 interviews/month',
      'Basic AI insights',
      'Email support',
      '1 interview room'
    ],
    cta: 'Start free trial',
    href: '/register',
    highlighted: false
  },
  {
    icon: Zap,
    name: 'Pro',
    tagline: 'For growing teams',
    price: 'Coming soon',
    period: '',
    desc: 'More interviews, advanced analytics, and priority support.',
    features: [
      'Unlimited interviews',
      'Advanced AI analytics',
      'Priority support',
      'Custom rubrics',
      'ATS integrations'
    ],
    cta: 'Get notified',
    href: '/landing/contact',
    highlighted: true
  },
  {
    icon: Building2,
    name: 'Enterprise',
    tagline: 'Scale and customize',
    price: 'Custom',
    period: '',
    desc: 'Dedicated support, SSO, custom workflows, and SLA.',
    features: [
      'Everything in Pro',
      'SSO & SAML',
      'Dedicated success manager',
      'Custom SLAs',
      'On-prem options'
    ],
    cta: 'Contact sales',
    href: '/landing/contact',
    highlighted: false
  }
];

export default function PricingPage() {
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
        <div
          className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 opacity-80"
          aria-hidden
        />
        <div className="container relative px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Simple pricing
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Plans for every{' '}
              <span className="bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                team size
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Start free, upgrade when you’re ready. Enterprise pricing available on request.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl px-8 shadow-lg shadow-primary/25"
              >
                <Link href="/register">Start free trial</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container px-4">
          <motion.div
            className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
            {plans.map(
              ({
                icon: Icon,
                name,
                tagline,
                price,
                period,
                desc,
                features,
                cta,
                href,
                highlighted
              }) => (
                <motion.div
                  key={name}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                  className={`relative flex flex-col rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 md:p-8 ${
                    highlighted
                      ? 'border-primary bg-card ring-2 ring-primary/30'
                      : 'border-border bg-card hover:border-primary/30 hover:shadow-xl'
                  }`}
                >
                  {highlighted && (
                    <div
                      className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-linear-to-r from-primary/80 via-primary to-primary/80"
                      aria-hidden
                    />
                  )}
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold">{name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight">{price}</span>
                    {period && <span className="text-muted-foreground">/{period}</span>}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <Check className="size-5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    size="lg"
                    className="mt-8 h-12 w-full rounded-xl"
                    variant={highlighted ? 'default' : 'outline'}
                  >
                    <Link href={href}>{cta}</Link>
                  </Button>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/15 py-16 md:py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Need a custom plan?</h2>
            <p className="mt-3 text-muted-foreground">
              For high-volume hiring, universities, or enterprise requirements, we’ll tailor pricing
              and features to your needs.
            </p>
            <Button asChild size="lg" className="mt-6 h-12 rounded-xl px-8">
              <Link href="/landing/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
