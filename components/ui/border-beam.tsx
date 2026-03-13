import { cn } from '@/lib/utils';

interface BorderBeamProps {
  className?: string;
  duration?: number;
}

export function BorderBeam({ className, duration = 6 }: BorderBeamProps) {
  return (
    <div
      style={{ '--duration': `${duration}s` } as React.CSSProperties}
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
    >
      <div className="beam-line absolute" />
    </div>
  );
}
