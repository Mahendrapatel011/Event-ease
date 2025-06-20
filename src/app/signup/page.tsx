import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "../auth/actions";
import { CalendarDays } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to get started with EventEase
            </p>
          </div>
           <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <form action={signup} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full mt-2 font-semibold">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-semibold hover:text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
       <div className="hidden bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center p-12 text-center">
        <div className="flex items-center gap-3 mb-4">
           <CalendarDays className="h-10 w-10 text-primary" />
           <h2 className="text-4xl font-bold tracking-tight">EventEase</h2>
        </div>
        <p className="mt-2 text-lg text-muted-foreground max-w-md">
            The all-in-one platform for seamless event management. From creation to RSVP, we've got you covered.
        </p>
      </div>
    </div>
  );
}