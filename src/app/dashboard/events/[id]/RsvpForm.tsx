// src/app/event/[id]/RsvpForm.tsx -- THIS IS A NEW FILE

"use client";

import { useState, useTransition } from "react";
import { handleRsvp } from "@/app/dashboard/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RsvpForm({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const onRsvpSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await handleRsvp(formData);
      setMessage(result.message);
      setIsSuccess(result.success);
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form action={onRsvpSubmit} className="space-y-4">
      {/* This hidden input is crucial */}
      <input type="hidden" name="eventId" value={eventId} />
      
      <div className="space-y-1">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" type="text" placeholder="John Doe" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
      </div>
      
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Submitting..." : "RSVP Now"}
      </Button>

      {message && !isSuccess && (
        <p className="text-sm text-center text-red-600 pt-2">{message}</p>
      )}
    </form>
  );
}