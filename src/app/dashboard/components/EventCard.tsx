"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "../events/actions";
import { toast } from "sonner";
import { Calendar, MapPin, Edit, Trash2, Eye } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: Date;
  location: string;
};

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("eventId", event.id);
        const result = await deleteEvent(formData);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Decorative top border with gradient */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex flex-col">
        <CardHeader>
          <CardTitle className="truncate font-bold text-lg">{event.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: 'long', year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex items-center gap-2 pt-4 mt-auto border-t bg-card p-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/events/${event.id}`}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Link>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          {/* --- THIS IS THE CORRECTED LINE --- */}
          <Link href={`/dashboard/events/${event.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Delete event"
          >
            {isPending ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}