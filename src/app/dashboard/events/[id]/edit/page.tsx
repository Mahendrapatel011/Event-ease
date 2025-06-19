import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { updateEvent } from "@/app/dashboard/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EditEventPageProps = {
  params: { id: string };
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  // 1. Get User and check session
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch the event data
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!event) {
    notFound(); // Show 404 if event doesn't exist
  }

  // 3. SECURITY CHECK: Ensure the logged-in user is the event owner
  if (event.authorId !== user.id) {
    // If not the owner, redirect them away. They cannot edit this.
    redirect("/dashboard");
  }
  
  // Helper to format the date correctly for the input field
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    // Adjust for timezone offset to display local time correctly
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
        <form action={updateEvent} className="space-y-6">
          {/* Hidden input to pass the event ID to the server action */}
          <input type="hidden" name="id" value={event.id} />
          
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" type="text" defaultValue={event.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Event Description</Label>
            <Textarea id="description" name="description" defaultValue={event.description} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date and Time</Label>
            <Input id="date" name="date" type="datetime-local" defaultValue={formatDateForInput(event.date)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" type="text" defaultValue={event.location} required />
          </div>

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}