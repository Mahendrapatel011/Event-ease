// src/app/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthBackground } from "./auth/components/AuthBackground"; // Reuse your cool background!
import { Calendar, CheckCircle, Users } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <AuthBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            <span className="block">Welcome to</span>
            <span className="block text-primary">EventEase</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            The all-in-one platform for seamless event management. From creation to RSVP, we've got you covered.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
        
        {/* Feature Section */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3 md:mt-24 max-w-4xl w-full">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Effortless Creation</h3>
            <p className="text-muted-foreground">Create and publish events in minutes with our intuitive form.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Manage RSVPs</h3>
            <p className="text-muted-foreground">Track attendees and manage your guest list with ease.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Simple & Secure</h3>
            <p className="text-muted-foreground">Secure authentication and a clean interface for a great experience.</p>
          </div>
        </div>
      </main>
    </>
  );
}