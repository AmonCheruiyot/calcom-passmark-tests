# I Replaced Fragile QA Tests with AI That Understands Intent — Here's What Broke

**📦 Full Repository:** https://github.com/AmonCheruiyot/calcom-passmark-tests

**🚀 Try the demo:** `npm run demo` — See AI execute tests in real-time

---

## The Problem: QA Tests That Break on Minor UI Changes

Modern QA automation often relies on brittle selectors:

```js
cy.get('[data-testid="booking-button-123"]')
page.locator('.calendar-slot:nth-child(3)')
```

This approach is deterministic, but fragile. Small DOM or class changes can invalidate entire suites, leading to constant maintenance overhead and reduced confidence in test coverage.

When testing a dynamic scheduling interface like Cal.com, this problem becomes more pronounced:

* asynchronous UI rendering
* timezone-sensitive views
* dynamic slot availability

The result is a test suite that is tightly coupled to implementation details rather than user intent.

---

## The Shift: From Selectors to Intent

Instead of encoding how to interact with the UI, what if tests described what the user wants to achieve?

Example:

> "Navigate to the booking page, select the first available time slot, fill in attendee details, and confirm the booking."

Using **Passmark**, this becomes executable.

---

## Architecture: AI-Orchestrated Browser Testing

This project integrates:

* **Passmark** → interprets natural language steps
* **Playwright** → executes browser automation
* **OpenRouter** → provides AI reasoning
* **Cal.com** → real-world system under test

**Execution Pipeline:**

```
┌─────────────────────────┐
│  Natural Language Step  │
│  "Select first slot"    │
└────────────┬────────────┘
             │
        ┌────▼──────────────┐
        │  AI (OpenRouter)  │
        │  Analyze + Reason │
        └────┬─────────────┐
             │             │
        ┌────▼──────────────┐
        │ Page Analysis     │
        │ Find Elements     │
        └────┬─────────────┬┘
             │             │
        ┌────▼──────────────┐
        │   Playwright      │
        │  Execute Action   │
        └────┬─────────────┘
             │
        ┌────▼──────────────┐
        │  Cal.com Booking  │
        │  (Real System)    │
        └───────────────────┘
```

**The execution model:**

1. Define steps in natural language via `runSteps()`
2. AI interprets UI context and determines actions
3. Playwright executes those actions
4. Assertions validate outcomes

This shifts the abstraction layer from DOM structure to user intent.

---

## The Golden Flow: Booking a Meeting

```ts
import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";
import { appConfig } from "../../helpers/config";

test("golden path booking demo - AI executes natural language steps", async ({ page }) => {
  test.skip(!appConfig.execution.demoMode, "This test only runs in demo mode");

  await runSteps({
    page,
    userFlow: "Book a meeting with a user on Cal.com using available time slots",
    steps: [
      {
        description: `Navigate to the Cal.com booking page at ${appConfig.calcom.bookingUrl}`
      },
      {
        description: "Select the first available time slot from today's date"
      },
      {
        description: "Fill the attendee name field with 'Demo User'"
      },
      {
        description: "Fill the attendee email field with 'demo@qa.local'"
      },
      {
        description: "Submit the booking form to confirm the meeting"
      }
    ],
    assertions: [
      {
        assertion: "The booking confirmation page is displayed with success message"
      },
      {
        assertion: "Confirmation details show the booked meeting information"
      }
    ],
    expect
  });
});
```

Notably absent:

* CSS selectors
* XPath queries
* DOM traversal logic

---

## Execution Behavior

Running:

```bash
npm run demo
```

Triggers:

* navigation to a deterministic booking URL from `CALCOM_BOOKING_URL`
* AI-driven UI analysis to identify available slots
* contextual selection of a valid time slot
* automated form completion
* validation of booking confirmation

**Expected Output:**

```
✓ golden path booking demo - AI executes natural language steps (89s)

HTML Report: reports/test-results/artifacts/index.html
Traces: reports/test-results/artifacts/*.trace.zip
Screenshots: reports/test-results/artifacts/
```

The output includes a Playwright HTML report, traces, and screenshots.

Average runtime: ~90 seconds per full flow.

---

## Engineering for Determinism

AI introduces probabilistic behavior. To stabilize execution for evaluation:

**Execution Controls:**

```
Single Worker      ═══════════════════════════════════════
Disabled Retries   ═══════════════════════════════════════
Extended Timeouts  ═══════════════════════════════════════
Stable Config      ═══════════════════════════════════════
Fixed Booking URL  ═══════════════════════════════════════

                   Isolates Variability
                   ✓ Reproducible Results
```

In this repo, those controls are implemented in `playwright.config.ts` and `helpers/config.ts`, and `DEMO_MODE=true` is set in `.env.demo`.

---

## Where AI Testing Breaks

Passmark removes selector fragility, but introduces **semantic ambiguity**.

### 1. Ambiguous Instructions

```js
{ description: "Select a time slot" }
```

**Failure Cases:**

```
Multiple Valid Targets ❌
├─ Monday 2pm slot
├─ Tuesday 10am slot
└─ Wednesday 3pm slot
   └─ AI: "Which one?"

Unclear Prioritization ❌
├─ First available? (by date? by time?)
├─ Next available? (from now? from today?)
└─ AI: "Ambiguous"

Layout Variations ❌
├─ Desktop calendar grid
├─ Mobile vertical list
└─ AI: "Different UI = different interpretation"
```

**Resolution:**

```js
{ description: "Select the first available time slot from today's date" }
```

✅ Precision in language directly impacts execution reliability.

### 2. UI Interpretation Drift

Observed issues:

* disabled elements misinterpreted as active
* similar UI elements confused (e.g. "Next" vs "Confirm")

Unlike selectors, AI depends on contextual inference, which can shift with minor UI changes.

### 3. Latency and Timing Sensitivity

AI adds:

* reasoning overhead
* increased susceptibility to async rendering delays

Mitigations required:

* longer timeouts
* stricter execution control

---

## Determinism vs Adaptability Trade-offs

```
SELECTOR-BASED           AI-DRIVEN
┌──────────────┐        ┌──────────────┐
│ ✓ Precise    │        │ ✓ Flexible   │
│ ✓ Stable     │        │ ✓ Readable   │
│ ✓ Debuggable │        │ ✓ Maintain   │
│ ✗ Brittle    │        │ ✗ Ambiguous  │
│ ✗ Tightly    │        │ ✗ Slower     │
│   coupled    │        │ ✗ Opaque     │
└──────────────┘        └──────────────┘
```

### Key Insight

> **Traditional QA fails when structure changes.**  
> **AI-driven QA fails when meaning becomes ambiguous.**

---

## Passmark vs Traditional Automation

### Code Comparison

**Using Playwright directly:**

```js
await page.locator('[data-testid="slot"]').nth(0).click();
```

**Using Passmark:**

```js
{ description: "Select the first available time slot from today's date" }
```

### Trade-offs Matrix

```
┌──────────────┬────────────────┬──────────────────┐
│ Dimension    │ Playwright     │ Passmark         │
├──────────────┼────────────────┼──────────────────┤
│ Readability  │ ████░░░░░░ Low │ ██████████ High  │
│ Stability    │ ██████████ High│ ██████░░░░ Med   │
│ Maintenance  │ ████░░░░░░ High│ ██████░░░░ Low   │
│ Debuggable   │ ██████████ High│ ████░░░░░░ Lower │
│ Speed        │ ██████████ Fast│ ██░░░░░░░░ Slow  │
└──────────────┴────────────────┴──────────────────┘
```

---

## When to Use Passmark

* rapid test prototyping
* UI-heavy applications
* collaboration with non-engineers

## When Not to Use It

* critical deterministic pipelines
* performance-sensitive CI
* highly ambiguous interfaces

---

## Production Perspective

This approach is best framed as:

* a **high-level regression layer**
* not a full replacement for deterministic tests

**Hybrid Model (Optimal):**

```
┌─────────────────────────────────┐
│   Comprehensive Test Suite      │
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────┐           │
│  │  AI-Driven Tests │  50%      │
│  │  (Coverage &     │           │
│  │  Readability)    │           │
│  └──────────────────┘           │
│                     ╱───────╲   │
│          ┌─────────────────────┐│
│          │ Overlapping         ││
│          │ Critical Paths      ││
│          └─────────────────────┘│
│                     ╲───────╱   │
│  ┌──────────────────┐           │
│  │ Selector-Based   │  50%      │
│  │ Tests (Critical  │           │
│  │ Guarantees)      │           │
│  └──────────────────┘           │
│                                 │
└─────────────────────────────────┘

Result: Optimal coverage, readability,
        and deterministic guarantees
```

---

## Conclusion

Testing a real booking flow on Cal.com exposed a fundamental shift in QA automation.

**Selector-based systems** are tightly coupled to structure.  
**AI-driven systems** are coupled to interpretation.

Passmark demonstrates that:

* tests can be written in human language
* UI interaction can be inferred
* maintenance overhead can be reduced

But this comes with a trade-off:

> **Reliability moves from code precision → language precision**

The future of QA is not purely AI-driven or purely deterministic.  
**It is compositional.**

---

## Ready to Explore?

**Repository:** https://github.com/AmonCheruiyot/calcom-passmark-tests

**Quick Start:**
```bash
git clone https://github.com/AmonCheruiyot/calcom-passmark-tests.git
cd calcom-passmark-tests
npm install
npm run demo
```

Check out `docs/DEMO_README.md` for detailed judge presentation scripts and verification steps.

---

#BreakingAppsHackathon #QA #Testing #Playwright #AI #Automation #Passmark #Calcom #RegressionTesting #NaturalLanguageTesting
