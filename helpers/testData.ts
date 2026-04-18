import bookingFixtures from "../fixtures/bookings.json";
import userFixtures from "../fixtures/users.json";

export type Attendee = {
  name: string;
  email: string;
};

export const attendees = {
  primary: userFixtures.primaryAttendee as Attendee,
  secondary: userFixtures.secondaryAttendee as Attendee,
  invalid: userFixtures.invalidAttendee as Attendee
};

export const bookingData = {
  defaultNotes: bookingFixtures.defaultNotes,
  rescheduleNotes: bookingFixtures.rescheduleNotes,
  stressNotes: bookingFixtures.stressNotes,
  timezones: bookingFixtures.timezones
};

export function uniqueAttendee(base: Attendee, tag: string): Attendee {
  const [localPart, domain = "example.com"] = base.email.split("@");
  const sanitizedTag = tag.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    name: `${base.name} ${tag}`,
    email: `${localPart}+${sanitizedTag}-${uniqueSuffix}@${domain}`
  };
}

