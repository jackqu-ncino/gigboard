export const APP_NAME = "GigBoard";
export const APP_DESCRIPTION =
  "Connect musicians with gig opportunities. Post gigs, find musicians, and build your band.";

export const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "professional", label: "Professional" },
] as const;

export const USER_ROLES = [
  { value: "musician", label: "Musician" },
  { value: "poster", label: "Gig Poster" },
  { value: "both", label: "Both" },
] as const;

export const GIG_STATUSES = [
  { value: "open", label: "Open" },
  { value: "filled", label: "Filled" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const APPLICATION_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
] as const;
