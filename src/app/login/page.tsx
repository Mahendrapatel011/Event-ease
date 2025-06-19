// app/login/page.tsx
import Link from "next/link";
import { login } from "../auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

function AuthMessage({ message }: { message?: string }) {
    if (!message) return null;
    return (<p className="text-sm p-3 bg-destructive/10 text-destructive rounded-lg text-center">{message}</p>);
}

export default function LoginPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <div className="w-full h-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form action={login} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <AuthMessage message={searchParams.message} />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex flex-col items-center justify-center p-12 text-center">
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