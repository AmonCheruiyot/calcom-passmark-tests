# Edge Cases

## Timezone Mismatch

The attendee intentionally changes to a distant timezone before booking. We verify that confirmation still reflects a coherent event state instead of silently shifting or dropping the timezone context.

## Invalid Inputs

The attendee reaches the booking form, submits malformed data, and must remain blocked from creating a booking. The test validates the system rejects bad input without drifting into a half-booked state.

## Refresh Mid-Flow

The browser refreshes after slot selection but before submit. The system should remain recoverable and not create ghost bookings or land on an invalid confirmation page.

## Back Navigation

The attendee uses the browser back button mid-booking. The system should remain on a sensible prior state and never show a false confirmation.

## Double Booking

Two actors target the same visible slot. The first should succeed. The second should receive a conflict or forced reselection, not a silent duplicate confirmation.

## Past Time Attempt

The actor tries to interact with a slot that should already be in the past. The expected outcome is prevention, disabled selection, or a clear guardrail that blocks progression to confirmation.
