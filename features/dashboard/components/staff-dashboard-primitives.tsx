import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { DashboardStat, SystemSettingSection } from '@/lib/dashboard/staff';
import { format } from 'date-fns';

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

export function PageIntro({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function StaffStatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="gap-1">
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-3xl">{stat.value.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">{stat.description}</CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardTable<T>({
  title,
  description,
  rows,
  columns,
  emptyLabel
}: {
  title: string;
  description: string;
  rows: T[];
  columns: Column<T>[];
  emptyLabel: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyLabel}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function DateCell({ value }: { value: Date | null }) {
  if (!value) {
    return <span className="text-muted-foreground">No interviews yet</span>;
  }

  return <span>{format(value, 'dd MMM yyyy, hh:mm a')}</span>;
}

export function VerificationBadge({ verified }: { verified: boolean | null }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0',
        verified
          ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
          : 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
      )}
    >
      {verified ? 'Verified' : 'Pending'}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0',
        role === 'SUPER_ADMIN'
          ? 'bg-violet-500/15 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'
          : 'bg-sky-500/15 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400'
      )}
    >
      {role === 'SUPER_ADMIN' ? 'Super admin' : 'Admin'}
    </Badge>
  );
}

export function SystemSettingsOverview({ sections }: { sections: SystemSettingSection[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4 rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'border-0 capitalize',
                    item.status === 'configured' &&
                      'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
                    item.status === 'missing' &&
                      'bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400',
                    item.status === 'info' &&
                      'bg-slate-500/15 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300'
                  )}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
