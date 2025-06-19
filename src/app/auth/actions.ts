// src/app/auth/actions.ts - SAHI CODE

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// BADLAV 1: Naya, sahi helper import kiya.
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// BADLAV 2: Yahan se purana, galat helper function DELETE kar diya gaya hai.

// SIGN UP ACTION
export async function signup(formData: FormData) {
  // Yeh ab naye, sahi helper ka istemaal karega
  const supabase = createSupabaseServerClient();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return redirect("/signup?message=All fields are required.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    console.error("Signup Auth Error:", error.message);
    return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  // Create user in Prisma User table
  if (data?.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          name: name,
        },
      });
    } catch (dbError) {
      // Ignore duplicate user error (if user already exists)
      if (typeof dbError === 'object' && dbError !== null && 'code' in dbError && dbError.code !== 'P2002') {
        console.error("Prisma user create error:", dbError);
        return redirect("/signup?message=Failed to create user in database.");
      }
    }
  }
  
  revalidatePath("/", "layout");
  return redirect("/login?message=Account created. Please verify your email to login.");
}

// LOGIN ACTION
export async function login(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return redirect("/login?message=Email and password are required.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login Error:", error.message);
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }
  
  revalidatePath("/", "layout"); 
  return redirect("/dashboard");
}

// LOGOUT ACTION
export async function logout() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  return redirect("/");
}