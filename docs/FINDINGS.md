# Findings

This file is intentionally seeded as a running log for hackathon discoveries.

## Suggested Format

- Date:
- Environment:
- Test:
- Observed behavior:
- Why it matters:
- Reproduction notes:
- Severity:

## Early Hypotheses

- Slot collision handling may surface different behaviors between tabs, sessions, and refresh timing.
- Timezone changes are likely to reveal summary inconsistencies or stale slot rendering.
- Rapid click handling may expose duplicate submits or stale loading states if server-side deduplication is weak.
- Interrupted sessions may reveal stale browser state that looks confirmed locally but is not persisted server-side.
- Cross-session viewing may expose eventual-consistency gaps if booking confirmation pages lag behind the mutation that created them.
