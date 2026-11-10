import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { errro: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) =>
    req.user?.id ? String(req.user?.id) : ipKeyGenerator(req.ip ?? ""),
  message: { error: "Too many requests, please slow down." },
});
