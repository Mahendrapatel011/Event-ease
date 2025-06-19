// src/app/dashboard/events/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Helper to return a structured response
type ActionResponse = {
  success: boolean;
  message: string;
};

// Zod schema for validation
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format."),
  location: z.string().min(2, "Location is required."),
});

// --- CREATE EVENT ---
export async function createEvent(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login?message=You must be logged in to create an event.");
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
  };

  const validation = eventSchema.safeParse(rawData);

  if (!validation.success) {
    // In a real app, you'd handle these errors more gracefully
    const errorMessage = validation.error.errors.map(e => e.message).join(', ');
    console.error("Validation Error:", errorMessage);
    return redirect(`/dashboard/events/create?error=${encodeURIComponent(errorMessage)}`);
  }

  try {
    await prisma.event.create({
      data: {
        ...validation.data,
        date: new Date(validation.data.date), // Convert string to Date
        authorId: user.id,
      },
    });
  } catch (error) {
    console.error("Prisma Create Error:", error);
    return redirect("/dashboard/events/create?error=Could not create the event.");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}


// --- UPDATE EVENT ---
export async function updateEvent(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const eventId = formData.get("id") as string;
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
  };

  const validation = eventSchema.safeParse(rawData);
   if (!validation.success || !eventId) {
    const errorMessage = validation.success ? "Event ID is missing." : validation.error.errors.map(e => e.message).join(', ');
    return redirect(`/dashboard/events/${eventId}/edit?error=${encodeURIComponent(errorMessage)}`);
  }
  
  // Security Check: Ensure user owns the event before updating
  const event = await prisma.event.findFirst({
      where: { id: eventId, authorId: user.id }
  });

  if (!event) {
      return redirect(`/dashboard?error=Unauthorized action or event not found.`);
  }

  try {
      await prisma.event.update({
          where: { id: eventId },
          data: {
              ...validation.data,
              date: new Date(validation.data.date),
          },
      });
  } catch (error) {
      console.error("Update Error:", error);
      return redirect(`/dashboard/events/${eventId}/edit?error=Failed to update event.`);
  }

  revalidatePath(`/dashboard/events/${eventId}`);
  revalidatePath("/dashboard");
  redirect(`/dashboard/events/${eventId}`);
}


// --- DELETE EVENT ---
export async function deleteEvent(formData: FormData): Promise<ActionResponse> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Authentication failed." };
  }

  const eventId = formData.get("eventId") as string;
  if (!eventId) {
    return { success: false, message: "Event ID is missing." };
  }
  
  // Security Check: Verify ownership
  const event = await prisma.event.findFirst({
      where: { id: eventId, authorId: user.id }
  });

  if (!event) {
      return { success: false, message: "Unauthorized or event not found." };
  }
  
  try {
    // Must delete dependent RSVPs first due to foreign key constraint
    await prisma.rSVP.deleteMany({
      where: { eventId: eventId },
    });
    
    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Event deleted successfully." };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete the event." };
  }
}

// --- HANDLE RSVP ---
const rsvpSchema = z.object({
  attendeeName: z.string().min(2, "Name is required."),
  attendeeEmail: z.string().email("Invalid email address."),
  eventId: z.string().cuid("Invalid Event ID."),
});

export async function handleRsvp(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    attendeeName: formData.get("name"),
    attendeeEmail: formData.get("email"),
    eventId: formData.get("eventId"),
  };

  const validation = rsvpSchema.safeParse(rawData);

  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message };
  }
  
  // Prevent duplicate RSVPs from the same email
  const existingRsvp = await prisma.rSVP.findFirst({
      where: {
          eventId: validation.data.eventId,
          attendeeEmail: validation.data.attendeeEmail,
      }
  });

  if (existingRsvp) {
      return { success: false, message: "This email has already RSVP'd for this event." };
  }

  try {
    await prisma.rSVP.create({
      data: validation.data,
    });
    
    // Revalidate the public event page to show the new RSVP (if owner is viewing)
    revalidatePath(`/events/${validation.data.eventId}`);
    
    return { success: true, message: "Thank you for your RSVP! We've received your details." };
  } catch (error) {
    console.error("RSVP Error:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}