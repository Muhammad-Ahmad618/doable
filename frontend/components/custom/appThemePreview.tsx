"use client";

type Theme = "light" | "dark" | "system";

export function ThemePreview({ theme }: { theme: Theme }) {
  const configs = {
    light: {
      bg: "#f4f4f5",
      sidebar: "#e4e4e7",
      bar: "#d4d4d8",
    },
    dark: {
      bg: "#18181b",
      sidebar: "#27272a",
      bar: "#3f3f46",
    },
    system: {
      bg: "linear-gradient(135deg, #f4f4f5 50%, #18181b 50%)",
      sidebar: "linear-gradient(135deg, #e4e4e7 50%, #27272a 50%)",
      bar: "linear-gradient(135deg, #d4d4d8 50%, #3f3f46 50%)",
    },
  };

  const c = configs[theme];

  return (
    <div
      className="h-20 flex gap-1.5 p-2 rounded-[6px]"
      style={{ background: c.bg }}
    >
      <div className="w-7 rounded" style={{ background: c.sidebar }} />
      <div className="flex-1 flex flex-col gap-1.5 justify-center">
        {[100, 60, 40].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded"
            style={{ background: c.bar, width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}
