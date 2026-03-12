import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { admins, platformSettings } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth/auth';
import { isSuperAdminRole } from '@/lib/dashboard/staff';
import { HTTP_STATUS } from '@/types/http';
import { APP_NAME } from '@/utils/constants/site';

const updatePlatformSettingsSchema = z.object({
  companyName: z.string().min(1),
  logoUrl: z.string().min(1)
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !isSuperAdminRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const [settings] = await db.select().from(platformSettings).limit(1);

    const [superAdmin] = await db
      .select({
        id: admins.id,
        name: admins.name,
        email: admins.email
      })
      .from(admins)
      .where(eq(admins.role, 'SUPER_ADMIN'))
      .limit(1);

    const tables = [
      'admins',
      'companies',
      'candidates',
      'interviewers',
      'interview_rooms',
      'resumes',
      'resume_ai_analysis',
      'questions',
      'interview_reports',
      'verification_tokens',
      'email_otp'
    ];

    const envVars = Object.entries(process.env).map(([key, value]) => ({
      key,
      value: value ?? ''
    }));

    return NextResponse.json(
      {
        companyName: settings?.companyName ?? APP_NAME,
        logoUrl:
          settings?.logoUrl ??
          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg',
        superAdmin: superAdmin ?? null,
        tables,
        envVars
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Get platform settings error:', error);
    return NextResponse.json(
      { error: 'Failed to load platform settings' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || !isSuperAdminRole(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const body = await req.json();
    const parsed = updatePlatformSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const [existing] = await db.select().from(platformSettings).limit(1);

    if (existing) {
      await db
        .update(platformSettings)
        .set({
          companyName: parsed.data.companyName,
          logoUrl: parsed.data.logoUrl
        })
        .where(eq(platformSettings.id, existing.id));
    } else {
      await db.insert(platformSettings).values({
        companyName: parsed.data.companyName,
        logoUrl: parsed.data.logoUrl
      });
    }

    return NextResponse.json({ success: true }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Update platform settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update platform settings' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

