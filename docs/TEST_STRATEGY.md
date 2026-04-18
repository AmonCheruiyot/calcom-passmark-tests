# Test Strategy

## Objective

This framework treats Cal.com as a real scheduling system that must survive both clean user journeys and chaotic booking behavior. The suite is intentionally designed to validate system integrity, not just whether a single button click works.

## Coverage Model

- `tests/core`: booking, cancellation, rescheduling, availability accuracy, and full lifecycle validation
- `tests/edge`: timezone drift, invalid inputs, refresh/back-button interruptions, double-booking protection, and past-time guardrails
- `tests/stress`: repeated clicks, multi-tab collisions, near-concurrent booking pressure, and interrupted-session recovery
- `tests/regression`: booking persistence, cancellation consistency, and cross-session confirmation integrity

## Architecture Principles

- Passmark handles natural-language execution through `runSteps`
- Playwright handles deterministic verification of page state and browser behavior
- Helpers in `helpers/flows.ts` centralize reusable flow orchestration and state assertions
- Fixtures keep attendee identities, notes, and environment expectations out of test logic

## Quality Bar

- Every test attempts to mutate real booking state or verify the system prevents invalid mutation
- Assertions target system outcomes: confirmed booking, cancellation persistence, conflict handling, and recoverability
- Tests are grouped by behavior type so findings map directly to reliability narratives in a hackathon demo or article

## Execution Order

1. Core flows first to confirm the target event is healthy and mutation-ready
2. Edge cases next to expose broken transitions and validation gaps
3. Stress scenarios after core reliability is confirmed
4. Regression checks last to prove state integrity after repeated mutation
