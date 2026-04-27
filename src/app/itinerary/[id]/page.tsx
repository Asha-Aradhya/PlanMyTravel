import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar/Navbar';
import ItineraryContent from '@/components/itinerary/ItineraryContent/ItineraryContent';
import type { TravelPreferences } from '@/types/preferences';
import styles from './page.module.scss';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    select: { destination: true },
  });
  return {
    title: itinerary ? `${itinerary.destination} — PlanMyTravel` : 'Itinerary — PlanMyTravel',
  };
}

export default async function SavedItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  const itinerary = await prisma.itinerary.findUnique({ where: { id } });

  if (!itinerary || itinerary.userId !== session.user.id) notFound();

  const preferences = itinerary.preferences as TravelPreferences;

  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.page}>
        <div className={styles.wrapper}>
          <Link href="/profile" className={styles.backLink}>
            ← Back to Profile
          </Link>

          <div className={styles.tripHeader}>
            <p className={styles.eyebrow}>Saved itinerary</p>
            <h1 className={styles.tripTitle}>{preferences.destination}</h1>
            <div className={styles.tripMeta}>
              <span>
                {new Date(preferences.startDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
              <span className={styles.metaDivider}>→</span>
              <span>
                {new Date(preferences.endDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
              <span className={styles.metaDivider}>·</span>
              <span>
                {preferences.travelers} {preferences.travelers === 1 ? 'traveller' : 'travellers'}
              </span>
            </div>
          </div>

          <ItineraryContent text={itinerary.content} />

          <div className={styles.actions}>
            <Link href="/plan/new" className={styles.newPlanBtn}>
              Plan Another Trip
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
