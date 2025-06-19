import { RSVP } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCircle2 } from "lucide-react";

interface AttendeeListProps {
  rsvps: RSVP[];
}

// नाम के पहले अक्षर पाने के लिए एक छोटा हेल्पर
const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function AttendeeList({ rsvps }: AttendeeListProps) {
  if (rsvps.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/50 text-muted-foreground rounded-lg border-2 border-dashed">
        <UserCircle2 className="mx-auto h-10 w-10" />
        <p className="mt-4 font-medium">No one has RSVP'd yet.</p>
        <p className="text-sm">Share your event to get attendees!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Name</TableHead>
            <TableHead className="text-right">RSVP Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rsvps.map((rsvp) => (
            <TableRow key={rsvp.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {getInitials(rsvp.attendeeName)}
                    </div>
                    <div>
                        <div className="font-medium">{rsvp.attendeeName}</div>
                        <div className="text-xs text-muted-foreground">{rsvp.attendeeEmail}</div>
                    </div>
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-xs">
                {new Date(rsvp.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}