import { AuthShowcase } from "@/components/features/auth/authShowCase";
import ForgotPasswordFrom from "@/components/features/auth/forgotPasswordFrom";

function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left: form */}
      <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-20">
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm sm:p-10 lg:border-none lg:bg-transparent lg:p-5 lg:shadow-none">
            <ForgotPasswordFrom />
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

export default ForgotPasswordPage;
