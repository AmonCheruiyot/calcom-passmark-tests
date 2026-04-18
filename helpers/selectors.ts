export const selectors = {
  fields: {
    name: [
      'input[name="name"]',
      'input[id="name"]',
      'input[placeholder*="name" i]'
    ],
    email: [
      'input[name="email"]',
      'input[type="email"]',
      'input[placeholder*="email" i]'
    ],
    notes: [
      'textarea[name="notes"]',
      'textarea[id="notes"]',
      'textarea[placeholder*="note" i]'
    ]
  },
  buttons: {
    confirm: /confirm|book|schedule|submit/i,
    cancel: /cancel/i,
    reschedule: /reschedule|pick a new time|change time/i
  },
  patterns: {
    confirmation: /confirmed|scheduled|you are booked|booking confirmed|successfully booked/i,
    cancellation: /cancelled|canceled|booking canceled|booking cancelled/i,
    reschedule: /reschedule|pick a new time|select a new time|change your booking/i,
    conflict: /no longer available|already booked|slot.*unavailable|choose another time|could not be booked/i,
    validation: /required|invalid|enter a valid|please fill/i
  }
};

