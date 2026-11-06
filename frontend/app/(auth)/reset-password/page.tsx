import { AuthShowcase } from "@/components/features/auth/authShowCase";
import ResetPasswordForm from "@/components/features/auth/resetPasswordForm";
import { Suspense } from "react";
import { Loader } from "lucide-react";

function ResetPasswordpage() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left: form */}
      <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-20">
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm sm:p-10 lg:border-none lg:bg-transparent lg:p-5 lg:shadow-none">
            <Suspense fallback={<Loader />}>
              <ResetPasswordForm />
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

export default ResetPasswordpage;
