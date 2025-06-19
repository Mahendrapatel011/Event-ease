// app/events/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RsvpForm } from "@/app/dashboard/events/[id]/RsvpForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AttendeeList } from "@/app/dashboard/events/[id]/AttendeeList";
import { User } from "@supabase/supabase-js";
import { AuthBackground } from "@/app/auth/components/AuthBackground"; // बैकग्राउंड का पुनः उपयोग करें
import { Calendar, MapPin, Users } from "lucide-react"; // आइकन्स

type EventPageProps = {
  params: { id: string };
};

export default async function EventPage({ params }: EventPageProps) {
  const supabase = createSupabaseServerClient();

  let user: User | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Error fetching user session (safely ignored):", error);
  }

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      rsvps: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!event) {
    notFound();
  }

  const isOwner = user?.id === event.authorId;

  return (
    <>
      <AuthBackground />
      <main className="relative z-10 container mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <div className="bg-card/80 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-2xl border">
          {/* हेडर */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              {event.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="text-lg">
                  {new Date(event.date).toLocaleString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <MapPin className="h-5 w-5 text-primary" />
                <p className="text-lg">{event.location}</p>
              </div>
            </div>
          </div>
          
          <hr className="my-8"/>

          {/* डिटेल्स */}
          <div className="prose prose-lg max-w-none">
            <p>{event.description}</p>
          </div>

          {/* अटेंडी या RSVP सेक्शन */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              {isOwner && (
                <>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <Users className="h-7 w-7"/> Event Attendees ({event.rsvps.length})
                  </h2>
                  <AttendeeList rsvps={event.rsvps} />
                </>
              )}
            </div>

            <div className="md:col-span-2">
                {!isOwner && (
                    <>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">RSVP for this Event</h2>
                        <RsvpForm eventId={event.id} />
                    </>
                )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}