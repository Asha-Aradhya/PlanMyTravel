import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: 'You must be signed in.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = await params;

  const itinerary = await prisma.itinerary.findUnique({ where: { id } });

  if (!itinerary) {
    return new Response(
      JSON.stringify({ error: 'Itinerary not found.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (itinerary.userId !== session.user.id) {
    return new Response(
      JSON.stringify({ error: 'Forbidden.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  await prisma.itinerary.delete({ where: { id } });

  return new Response(null, { status: 204 });
}
