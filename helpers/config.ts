import dotenv from "dotenv";
import environments from "../fixtures/environments.json";

dotenv.config();

const placeholderBookingUrl = "https://cal.com/team/example/30min";

function requiredVarsForExecution(): string[] {
  return ["CALCOM_BOOKING_URL", "REDIS_URL"];
}

function configuredRequiredVars(): string[] {
  return requiredVarsForExecution().filter((name) => {
    const value = process.env[name];
    return Boolean(value && value.trim());
  });
}

export const appConfig = {
  calcom: {
    baseUrl: process.env.CALCOM_BASE_URL || "https://cal.com",
    bookingUrl: process.env.CALCOM_BOOKING_URL || placeholderBookingUrl,
    eventName: process.env.CALCOM_EVENT_NAME || "Cal.com Scheduling Event",
    defaultTimezone: process.env.CALCOM_DEFAULT_TIMEZONE || "America/New_York"
  },
  ai: {
    openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
    openRouterModel: process.env.OPENROUTER_MODEL || "anthropic/claude-3.7-sonnet",
    openRouterBaseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    openRouterHttpReferer: process.env.OPENROUTER_HTTP_REFERER || "",
    openRouterAppTitle: process.env.OPENROUTER_APP_TITLE || "calcom-passmark-tests",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
    googleApiKey: process.env.GOOGLE_API_KEY || "",
    redisUrl: process.env.REDIS_URL || ""
  },
  execution: {
    placeholderBookingUrl,
    requiredVarsForExecution: requiredVarsForExecution(),
    configuredRequiredVars: configuredRequiredVars(),
    isReadyForLiveRun:
      Boolean(process.env.CALCOM_BOOKING_URL && process.env.REDIS_URL) &&
      process.env.CALCOM_BOOKING_URL !== placeholderBookingUrl,
    missingMessage:
      "Set CALCOM_BOOKING_URL to a real Cal.com event page and REDIS_URL before running live mutation tests."
  },
  fixtures: {
    environments
  }
};

