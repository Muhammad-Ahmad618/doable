"use client";

export function PasswordStrength({ password }: { password: string }) {
  const getScore = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const score = getScore();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "text-destructive",
    "text-amber-500",
    "text-green-500",
    "text-green-500",
  ];
  const segColors = [
    "",
    "bg-destructive",
    "bg-amber-500",
    "bg-green-500",
    "bg-green-500",
  ];

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors ${
              i <= score ? segColors[score] : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs ${colors[score]}`}>{labels[score]}</span>
    </div>
  );
}
