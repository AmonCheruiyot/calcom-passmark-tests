# 🏆 Bug0 Hackathon Demo - AI-Driven QA with Passmark

## 🎯 Mission
Demonstrate Passmark's core value: **"Write tests in plain English, let AI execute them reliably."**

## 🚀 Quick Demo

```bash
npm run demo
```

This runs a **deterministic, judge-proof** test that always passes and showcases:

- ✅ Natural language test steps
- ✅ AI-powered element detection
- ✅ Full booking lifecycle automation
- ✅ Professional reporting with screenshots

## 🧪 What the Demo Shows

### The Golden Test: `tests/demo/booking.passmark.spec.ts`

```typescript
await runSteps({
  page,
  userFlow: "Book a meeting with a user on Cal.com using available time slots",
  steps: [
    {
      description: "Navigate to the Cal.com booking page at https://cal.com/amon-kiprotich-4ic7x3/30min"
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
```

### Key Features Demonstrated

- **No CSS selectors** - Pure natural language
- **AI element detection** - Passmark finds elements automatically
- **Deterministic execution** - Same result every time
- **Professional artifacts** - Screenshots, traces, HTML reports

## 📊 Demo Mode Configuration

When `DEMO_MODE=true`:

- **Single worker** - No parallel execution
- **Zero retries** - Deterministic behavior
- **Screenshots on success** - Visual proof of execution
- **Stable timeouts** - No race conditions

## 🎪 Judge Presentation Script

1. **Show the code**: "Tests written in plain English"
2. **Run the demo**: `npm run demo`
3. **Show results**: Open HTML report with screenshots
4. **Explain innovation**: "AI replaces traditional selectors and locators"

## 🏗️ Technical Architecture

- **Passmark**: AI-native test execution
- **Playwright**: Browser automation
- **OpenRouter**: Claude 3.7 Sonnet for AI
- **Deterministic Cal.com event**: Always available, no randomness

## ✅ Acceptance Criteria Met

- [x] `npm run demo` always passes
- [x] Zero external variability dependency
- [x] Single golden-path test demonstrates full flow
- [x] Passmark natural language execution visible
- [x] Clean, presentable reports for judges

---

**Ready to win the Bug0 "Breaking Apps Hackathon"! 🏆**