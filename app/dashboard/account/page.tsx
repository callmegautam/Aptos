'use client';

import { useState, useMemo, FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const DEFAULT_NAME = 'Interviewer';
const DEFAULT_EMAIL = 'interviewer@company.com';
const DEFAULT_AVATAR = 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { AlertTriangleIcon } from 'lucide-react';

const DeleteAccountDialog = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? All of your data will be permanently
              removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AccountPage = () => {
  const [name, setName] = useState(DEFAULT_NAME);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const avatarPreview = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    return DEFAULT_AVATAR;
  }, [avatarFile]);

  const initials = useMemo(
    () =>
      name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
    [name]
  );

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-6">
      <DeleteAccountDialog open={open} setOpen={setOpen} />
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information, security, and account controls.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.35fr)] xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Control how your information appears across Aptos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-8" onSubmit={handleProfileSubmit}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 sm:gap-6">
                  <Avatar className="size-20 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                    <AvatarImage src={avatarPreview} alt={name} />
                    <AvatarFallback className="rounded-full text-lg font-semibold">
                      {initials || 'IN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium leading-none">{name || DEFAULT_NAME}</p>
                    <p className="text-xs text-muted-foreground">
                      This is your public avatar. Upload a square image for best results.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <Label className="cursor-pointer">
                    <span className="sr-only">Upload avatar</span>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm">
                      Change avatar
                    </Button>
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="px-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setAvatarFile(null)}
                  >
                    Reset to default
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-1.5 md:col-span-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={DEFAULT_EMAIL}
                    disabled
                    aria-readonly="true"
                    className="bg-muted/40"
                  />
                  {/* <p className="text-xs text-muted-foreground">
                    Email is managed by your workspace administrator and cannot be changed here.
                  </p> */}
                </div>
              </div>

              {/* {isEdit && (
                <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Changes are not saved automatically.
                  </p>
                  <Button type="submit" className="w-full sm:w-auto">
                    Save changes
                  </Button>
                </div>
              )} */}

              <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Changes are not saved automatically.
                </p>
                <Button type="submit" className="w-full sm:w-auto">
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Set a secure password to protect your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div className="space-y-1.5">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input id="current-password" type="password" autoComplete="current-password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New password</Label>
                  <Input id="new-password" type="password" autoComplete="new-password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input id="confirm-password" type="password" autoComplete="new-password" />
                </div>
                {/* {isEdit && (
                  <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Use at least 8 characters with a mix of letters, numbers, and symbols.
                    </p>
                    <Button type="submit" className="w-full sm:w-auto">
                      Update password
                    </Button>
                  </div>
                )} */}
                <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Use at least 8 characters with a mix of letters, numbers, and symbols.
                  </p>
                  <Button type="submit" className="w-full sm:w-auto">
                    Update password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className="border-destructive/20 bg-destructive/5 mt-4">
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. Please make sure you have exported any data you want
                to keep before deleting your account.
              </p>
              <Button
                type="button"
                variant="destructive"
                className="w-full justify-center"
                onClick={() => setOpen(true)}
              >
                Delete account
              </Button>
              <Button type="button" variant="outline" className="w-full justify-center">
                Log out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
