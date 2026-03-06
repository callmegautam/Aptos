import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-none text-center">
        <CardContent className="flex flex-col items-center pt-6 gap-2">
          <h1 className="text-6xl font-extrabold tracking-tighter text-primary">404</h1>
          <h2 className="text-xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground mb-4">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
