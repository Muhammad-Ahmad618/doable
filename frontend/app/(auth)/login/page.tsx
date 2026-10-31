"use client";
import { LoginForm } from "@/components/features/auth/loginForm";
import { AuthShowcase } from "@/components/features/auth/authShowCase";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left: form */}
      <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-20">
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md p-10 border rounded-lg lg:border-none lg:p-5">
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  <Loader2 />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Doable. All rights reserved.
        </p>
      </section>

      {/* Right: product showcase (hidden on small screens) */}
      <AuthShowcase />
    </main>
  );
}

export default LoginPage;
