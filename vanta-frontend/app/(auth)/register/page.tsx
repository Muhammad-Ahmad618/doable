"use client";
import { AuthShowcase } from "@/components/features/auth/authShowCase";
import { RegisterForm } from "@/components/features/auth/registerForm";

function register() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left: form */}
      <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-20">
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md p-10 border rounded-lg lg:border-none lg:p-5">
            <RegisterForm />
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

export default register;
