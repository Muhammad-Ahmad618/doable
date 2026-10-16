import { Check, Sparkles } from "lucide-react";

export function AuthShowcase() {
  return (
    <section className="relative hidden overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 lg:flex lg:flex-col lg:justify-between lg:p-14">
      {/* floating animation */}
      <style>{`
        @keyframes doable-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />

      {/* Headline */}
      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Your tasks, finally in one place
        </div>
        <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white">
          Plan your work.
          <br />
          Finish what matters.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-blue-100">
          Doable keeps your tasks, projects and team in a single workspace, so
          nothing slips through the cracks.
        </p>
      </div>

      {/* Product preview */}
      <div className="relative z-10 my-10 flex justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-100/80">
                Project
              </p>
              <p className="text-lg font-semibold text-white">Launch Sprint</p>
            </div>
            <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-200">
              On track
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-blue-100">
              <span>Progress</span>
              <span className="font-semibold text-white">68%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[68%] rounded-full bg-linear-to-r from-cyan-300 to-white" />
            </div>
          </div>

          <ul className="mt-5 space-y-2.5">
            <TaskRow done title="Finalize landing page copy" tag="Design" />
            <TaskRow done title="Set up CI/CD pipeline" tag="Dev" />
            <TaskRow title="Review pull requests" tag="Dev" due="Today" />
            <TaskRow
              title="Write launch announcement"
              tag="Marketing"
              due="Fri"
            />
          </ul>
        </div>

        {/* Floating chip: top right */}
        <div
          className="absolute -right-2 -top-5 flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5 shadow-xl"
          style={{ animation: "doable-float 5s ease-in-out infinite" }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-slate-900">
              12 tasks done
            </p>
            <p className="text-xs text-slate-500">this week</p>
          </div>
        </div>

        {/* Floating chip: bottom left */}
        <div
          className="absolute -bottom-6 -left-2 flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-xl"
          style={{ animation: "doable-float 6s ease-in-out 1s infinite" }}
        >
          <div className="flex -space-x-2">
            {["bg-rose-400", "bg-amber-400", "bg-sky-400"].map((c, i) => (
              <span
                key={i}
                className={`h-7 w-7 rounded-full border-2 border-white ${c}`}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-slate-600">
            3 teammates online
          </p>
        </div>
      </div>

      {/* Bottom line */}
      <p className="relative z-10 max-w-md text-sm leading-relaxed text-blue-100">
        Built for people who want a calm, clear view of everything on their
        plate.
      </p>
    </section>
  );
}

function TaskRow({
  title,
  tag,
  due,
  done,
}: {
  title: string;
  tag: string;
  due?: string;
  done?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-white/10 px-3.5 py-2.5">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          done
            ? "border-emerald-300 bg-emerald-300 text-indigo-900"
            : "border-white/40"
        }`}
      >
        {done && <Check className="h-3 w-3" strokeWidth={3.5} />}
      </span>
      <span
        className={`flex-1 truncate text-sm ${
          done ? "text-white/60 line-through" : "font-medium text-white"
        }`}
      >
        {title}
      </span>
      {due && <span className="text-xs font-medium text-amber-200">{due}</span>}
      <span className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white/90">
        {tag}
      </span>
    </li>
  );
}
