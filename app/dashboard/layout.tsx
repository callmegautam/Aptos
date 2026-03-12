'use client';

import {
  Building2,
  ChevronRight,
  ChevronsUpDown,
  FileCheck,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  UserCog,
  Users,
  Video
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import axios from 'axios';
import { HTTP_STATUS } from '@/types/http';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/user-store';

const logout = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  useUserStore.getState().clearUser();
  window.location.href = '/login';
};

// Base nav item - used by simple sidebars
type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  isActive?: boolean;
  // Optional children for submenus (Sidebar3+)
  children?: NavItem[];
};

// Nav group with optional collapsible state
type NavGroup = {
  title: string;
  items: NavItem[];
  // Optional: default collapsed state (Sidebar2+)
  defaultOpen?: boolean;
};

// User data for footer (Sidebar6+)
type UserData = {
  name: string;
  email: string;
  avatar: string;
};

// Complete sidebar data structure
type SidebarData = {
  // Logo/branding (all sidebars)
  logo: {
    src: string;
    alt: string;
    title: string;
    description: string;
  };
  // Main navigation groups (all sidebars)
  navGroups: NavGroup[];
  // Footer navigation group (all sidebars)
  footerGroup: NavGroup;
  // User data for user footer (Sidebar6+)
  user?: UserData;
  // Workspaces for switcher (Sidebar7+)
  workspaces?: Array<{
    id: string;
    name: string;
    logo: string;
    plan: string;
  }>;
  // Currently active workspace (Sidebar7+)
  activeWorkspace?: string;
};

const logoData: SidebarData['logo'] = {
  src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg',
  alt: 'Aptos',
  title: 'Aptos',
  description: 'AI Interview Platform'
};

const defaultAvatar = 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp';

function getSidebarData(user: ReturnType<typeof useUserStore.getState>['user']): SidebarData {
  const role = user?.role;
  const isStaff = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  if (isStaff) {
    return {
      logo: logoData,
      navGroups: [
        {
          title: 'Overview',
          defaultOpen: true,
          items: [
            { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
            { label: 'Companies', icon: Building2, href: '/dashboard/companies' },
            { label: 'Interviewers', icon: Users, href: '/dashboard/interviewers' },
            { label: 'Candidates', icon: User, href: '/dashboard/candidates' }
          ]
        },
        ...(isSuperAdmin
          ? [
              {
                title: 'Platform',
                defaultOpen: true,
                items: [
                  { label: 'Admins', icon: UserCog, href: '/dashboard/admins' },
                  { label: 'Settings', icon: Settings, href: '/dashboard/settings' }
                ]
              }
            ]
          : [])
      ],
      footerGroup: {
        title: 'Support',
        items: [{ label: 'Help Center', icon: HelpCircle, href: '/dashboard/help' }]
      },
      user: user
        ? {
            name: user.name,
            email: user.email,
            avatar: user.avatar || defaultAvatar
          }
        : undefined
    };
  }

  return {
    logo: logoData,

    navGroups: [
      {
        title: 'Overview',
        defaultOpen: true,
        items: [
          { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
          { label: 'Rooms', icon: Video, href: '/dashboard/rooms' },
          { label: 'Reports', icon: FileCheck, href: '/dashboard/reports' }
        ]
      },
      ...(user?.role === 'COMPANY'
        ? [
            {
              title: 'Team',
              defaultOpen: true,
              items: [{ label: 'Interviewers', icon: Users, href: '/dashboard/interviewers' }]
            }
          ]
        : [])
    ],
    footerGroup: {
      title: 'Support',
      items: [{ label: 'Help Center', icon: HelpCircle, href: '/dashboard/help' }]
    },
    user: user
      ? {
          name: user.name,
          email: user.email,
          avatar: user.avatar || defaultAvatar
        }
      : undefined
  };
}

const SidebarLogo = ({ logo }: { logo: SidebarData['logo'] }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary">
            <img
              src={logo.src}
              alt={logo.alt}
              className="size-6 text-primary-foreground invert dark:invert-0"
            />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">{logo.title}</span>
            <span className="text-xs text-muted-foreground">{logo.description}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const NavMenuItem = ({ item }: { item: NavItem }) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={item.isActive}>
          <Link href={item.href} className="flex items-center gap-2">
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={item.isActive}>
            <Icon className="size-4" />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children!.map((child) => (
              <SidebarMenuSubItem key={child.label}>
                <SidebarMenuSubButton asChild isActive={child.isActive}>
                  <Link href={child.href} className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span>{child.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavUser = ({ user, role }: { user: UserData; role?: string }) => {
  const isStaff = role === 'ADMIN' || role === 'SUPER_ADMIN';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/account">
                <User className="mr-2 size-4" />
                Account
              </Link>
            </DropdownMenuItem>
            {!isStaff && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription">
                  <Settings className="mr-2 size-4" />
                  Subscription
                </Link>
              </DropdownMenuItem>
            )}
            {role === 'SUPER_ADMIN' && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <ShieldCheck className="mr-2 size-4" />
                  System Settings
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

function isActivePath(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== '/dashboard' && pathname.startsWith(href + '/')) return true;
  return false;
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const sidebarData = getSidebarData(user);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo logo={sidebarData.logo} />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="min-h-0 flex-1">
          {sidebarData.navGroups.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <NavMenuItem
                      key={item.label}
                      item={{
                        ...item,
                        isActive: isActivePath(pathname ?? '', item.href)
                      }}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        {sidebarData.user && <NavUser user={sidebarData.user} role={user?.role} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

interface DashboardLayoutProps {
  className?: string;
  children: React.ReactNode;
}

// function getPageTitle(pathname: string): string {
//   return (
//     (pathname?.split('/').pop()?.replace(/-/g, ' ').charAt(0).toUpperCase() ?? '') +
//     (pathname?.split('/').pop()?.replace(/-/g, ' ').slice(1) ?? '')
//   );
// }

function getPageTitle(pathname: string): string {
  if (!pathname) return '';

  const segment = pathname.split('/').pop() ?? '';
  const formatted = segment.replace(/-/g, ' ');

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        const data = response.data;
        if (response.status === HTTP_STATUS.OK) {
          useUserStore.getState().setUser({
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatarUrl
          });
        }
      } catch (error) {
        console.error('Error fetching me:', error);
        toast.error('Failed to fetch user data');
      }
    };

    fetchMe();
  }, []);

  return (
    <SidebarProvider className={cn(className)}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 hidden data-[orientation=vertical]:h-4 md:block"
          />
          <a href="/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary">
              <img
                src={logoData.src}
                alt={logoData.alt}
                className="size-6 text-primary-foreground invert dark:invert-0"
              />
            </div>
            <span className="font-semibold">{logoData.title}</span>
          </a>
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Overview</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle(pathname ?? '')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4  lg:px-20">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
