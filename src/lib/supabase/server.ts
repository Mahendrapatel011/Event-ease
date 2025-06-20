// Corrected src/lib/supabase/server.ts

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // The fix is here: catch {} without the unused (error) variable
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // This is a server-side component, and setting cookies can fail if called
            // during a pre-render. We can safely ignore this error.
          }
        },
        remove(name: string, options: CookieOptions) {
          // The fix is also here: catch {} without the unused (error) variable
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // This is a server-side component, and setting cookies can fail if called
            // during a pre-render. We can safely ignore this error.
          }
        },
      },
    }
  );
};