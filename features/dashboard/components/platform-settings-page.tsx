'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { PageIntro } from '@/features/dashboard/components/staff-dashboard-primitives';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { HTTP_STATUS } from '@/types/http';

type EnvVar = {
  key: string;
  value: string;
};

type SuperAdminInfo = {
  id: number;
  name: string;
  email: string;
} | null;

type PlatformSettingsResponse = {
  companyName: string;
  logoUrl: string;
  superAdmin: SuperAdminInfo;
  tables: string[];
  envVars: EnvVar[];
};

const PlatformSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingSuperAdmin, setSavingSuperAdmin] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [superAdmin, setSuperAdmin] = useState<SuperAdminInfo>(null);
  const [superAdminEmail, setSuperAdminEmail] = useState('');
  const [superAdminPassword, setSuperAdminPassword] = useState('');
  const [tables, setTables] = useState<string[]>([]);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, status } = await axios.get<PlatformSettingsResponse>(
          '/api/platform/settings'
        );
        if (status !== HTTP_STATUS.OK) {
          throw new Error('Failed to load settings');
        }

        setCompanyName(data.companyName);
        setLogoUrl(data.logoUrl);
        setSuperAdmin(data.superAdmin);
        setSuperAdminEmail(data.superAdmin?.email ?? '');
        setTables(data.tables);
        setEnvVars(data.envVars);
      } catch (error) {
        console.error('Error loading platform settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const maskedEnvVars = useMemo(
    () =>
      envVars.map((env) => ({
        key: env.key,
        value:
          env.value && env.value.length > 4
            ? `${env.value.slice(0, 4)}*** (${env.value.length} chars)`
            : env.value
      })),
    [envVars]
  );

  const handleSaveCompany = async () => {
    if (!companyName.trim() || !logoUrl.trim()) {
      toast.error('Company name and logo URL are required');
      return;
    }

    try {
      setSavingCompany(true);
      await axios.put(
        '/api/platform/settings',
        {
          companyName: companyName.trim(),
          logoUrl: logoUrl.trim()
        },
        {
          validateStatus: () => true
        }
      );
      toast.success('Platform branding updated');
    } catch (error) {
      console.error('Error saving platform branding:', error);
      toast.error('Failed to save platform branding');
    } finally {
      setSavingCompany(false);
    }
  };

  const handleSaveSuperAdmin = async () => {
    if (!superAdmin) {
      toast.error('No super admin found to update');
      return;
    }

    if (!superAdminEmail.trim()) {
      toast.error('Super admin email is required');
      return;
    }

    try {
      setSavingSuperAdmin(true);
      const payload: { email: string; password?: string } = {
        email: superAdminEmail.trim()
      };
      if (superAdminPassword.trim()) {
        payload.password = superAdminPassword.trim();
      }

      const response = await axios.patch(`/api/admin/${superAdmin.id}`, payload, {
        validateStatus: () => true
      });

      if (response.status === HTTP_STATUS.OK) {
        toast.success('Super admin credentials updated');
        setSuperAdmin((prev) =>
          prev ? { ...prev, email: superAdminEmail.trim() } : prev
        );
        setSuperAdminPassword('');
      } else {
        const errorMessage =
          (response.data && (response.data.error as string)) ||
          'Failed to update super admin';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating super admin:', error);
      toast.error('Failed to update super admin');
    } finally {
      setSavingSuperAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <PageIntro
          title="System Settings"
          description="Manage platform branding, super admin credentials, and view infrastructure configuration."
        />
        <p className="text-sm text-muted-foreground">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageIntro
        title="System Settings"
        description="Super admins can configure platform branding and credentials, and review database and environment configuration."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform branding</CardTitle>
            <CardDescription>
              Update the company name and logo used across the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              {logoUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Preview:</span>
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-8 w-8 rounded bg-muted object-contain"
                  />
                </div>
              )}
            </div>
            <div className="pt-2">
              <Button onClick={handleSaveCompany} disabled={savingCompany}>
                {savingCompany ? 'Saving…' : 'Save branding'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Super admin account</CardTitle>
            <CardDescription>
              Update the primary super admin&apos;s email and password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {superAdmin ? (
              <>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{superAdmin.name}</p>
                  <p className="text-muted-foreground">
                    Current email: <span className="font-mono">{superAdmin.email}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="superAdminEmail">New email</Label>
                  <Input
                    id="superAdminEmail"
                    type="email"
                    value={superAdminEmail}
                    onChange={(e) => setSuperAdminEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="superAdminPassword">New password (optional)</Label>
                  <Input
                    id="superAdminPassword"
                    type="password"
                    value={superAdminPassword}
                    onChange={(e) => setSuperAdminPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to keep the current password.
                  </p>
                </div>
                <div className="pt-2">
                  <Button onClick={handleSaveSuperAdmin} disabled={savingSuperAdmin}>
                    {savingSuperAdmin ? 'Saving…' : 'Save super admin'}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No super admin account was found. Create a super admin from the Admins page.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database tables</CardTitle>
            <CardDescription>Read-only list of application tables.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table}>
                    <TableCell className="font-mono text-xs">{table}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment variables</CardTitle>
            <CardDescription>
              Read-only view of environment keys (values partially masked for safety).
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] space-y-2 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maskedEnvVars.map((env) => (
                  <TableRow key={env.key}>
                    <TableCell className="font-mono text-xs">{env.key}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {env.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformSettingsPage;

