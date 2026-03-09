'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const SubscriptionPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscription</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>Manage your billing and subscription details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Company plan</p>
              <p className="text-sm text-muted-foreground">
                Billed monthly. Unlimited interview rooms and reports.
              </p>
            </div>
            <Button type="button" className="mt-2">
              Manage subscription
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upgrade</CardTitle>
            <CardDescription>
              Explore higher limits, advanced analytics, and priority support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Connect this page to your billing provider (Stripe, Lemon Squeezy, etc.) to allow
              users to change plans, update payment methods, and download invoices.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;

