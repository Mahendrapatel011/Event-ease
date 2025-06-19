"use client";

// src/app/dashboard/events/create/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "../actions";

export default function CreateEventPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a New Event</CardTitle>
          <CardDescription>
            Fill in the details below to create your event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createEvent} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Annual Tech Conference"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="date">Date & Time</Label>
                    <Input id="date" name="date" type="datetime-local" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        name="location"
                        placeholder="e.g., Online or City Hall"
                        required
                    />
                </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button type="submit">Create Event</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}