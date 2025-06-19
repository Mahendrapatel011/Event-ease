// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "../auth/actions";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { EventCard } from "./components/EventCard";
import { PlusCircle, FileText } from "lucide-react"; // आकर्षक आइकन्स

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Supabase auth से user की ID का उपयोग करके Prisma से user का पूरा विवरण प्राप्त करें
  const prismaUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const userEvents = await prisma.event.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // यदि Prisma में नाम है, तो उसका उपयोग करें, अन्यथा ईमेल का उपयोग करें
  const displayName = prismaUser?.name || user.email;

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <header className="flex items-center justify-between p-4 bg-card border-b sticky top-0 z-20">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground hidden sm:block">
            Welcome, <span className="font-semibold text-foreground">{displayName}</span>
          </p>
          <form action={logout}>
            <Button variant="outline" type="submit">Logout</Button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Events</h2>
          <Button asChild>
            <Link href="/dashboard/events/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Event
            </Link>
          </Button>
        </div>

        {userEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-16 px-6 bg-card rounded-lg border-2 border-dashed">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Events Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You haven't created any events yet.
            </p>
            <Button asChild className="mt-6">
                <Link href="/dashboard/events/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Event
                </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}