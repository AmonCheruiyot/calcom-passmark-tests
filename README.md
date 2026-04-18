# calcom-passmark-tests

AI-driven end-to-end regression framework for **Cal.com** using **Playwright** and **Passmark**, with environment scaffolding for **OpenRouter**-oriented model routing.

## What This Suite Is For

This is not a shallow UI smoke suite.

It is designed to simulate:

- real attendee booking behavior
- booking interruptions and invalid input
- multi-tab and race-condition pressure
- state persistence after refresh and history changes

The goal is to generate reliability insights for a hackathon-quality technical submission.

## Project Structure

```text
calcom-passmark-tests/
├── tests/
│   ├── core/
│   ├── edge/
│   ├── stress/
│   └── regression/
├── helpers/
│   ├── flows.ts
│   ├── testData.ts
│   ├── config.ts
│   └── selectors.ts
├── reports/
├── docs/
├── fixtures/
├── .env
├── playwright.config.ts
└── README.md
```

## Included Test Coverage

### Core

- booking a meeting
- cancelling a meeting
- rescheduling a meeting
- availability checks
- end-to-end full lifecycle

### Edge

- timezone mismatch handling
- invalid input rejection
- refresh during booking
- back navigation during booking
- double booking attempt
- past-time booking prevention

### Stress

- rapid clicking on booking submit
- multi-tab conflicts
- near-concurrent booking attempts
- session interruption recovery

### Regression

- booking persistence after refresh
- cancellation consistency across UI state changes
- cross-session consistency

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:

- `CALCOM_BOOKING_URL` with a real Cal.com event URL you control
- `REDIS_URL` for Passmark caching
- AI provider credentials required by your Passmark setup

3. Install Playwright browsers:

```bash
npx playwright install
```

4. Run the suite:

```bash
npm test
```

## Important Runtime Notes

- These tests mutate real booking state, so a dedicated staging event is strongly recommended.
- The suite skips live execution if `CALCOM_BOOKING_URL` or `REDIS_URL` is missing.
- Passmark's public docs currently show `runSteps` usage plus Redis and model-provider credentials; this scaffold includes `OPENROUTER_*` environment fields for your gateway strategy, but you should confirm the exact provider wiring your Passmark runtime expects before a live run.

## Design Approach

- Use Passmark for natural-language step execution and high-level assertions.
- Use Playwright for deterministic browser control, refresh/navigation coverage, and explicit state checks.
- Keep helpers generic so the suite can expand into account-level flows, reminders, buffers, or team scheduling later.
