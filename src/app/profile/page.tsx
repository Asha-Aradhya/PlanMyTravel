import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar/Navbar';
import ProfileView from '@/components/profile/ProfileView/ProfileView';
import type { TravelPreferences } from '@/types/preferences';
import styles from './page.module.scss';

export const metadata = {
  title: 'Profile — PlanMyTravel',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  const rawItineraries = await prisma.itinerary.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      destination: true,
      preferences: true,
      createdAt: true,
    },
  });

  const itineraries = rawItineraries.map(item => ({
    id: item.id,
    destination: item.destination,
    preferences: item.preferences as TravelPreferences,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.page}>
        <ProfileView user={session.user} itineraries={itineraries} />
      </main>
    </>
  );
}
