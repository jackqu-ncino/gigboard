// Core entity types matching the database schema

export type UserRole = "musician" | "poster" | "both" | "admin";
export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "professional";
export type GigStatus = "open" | "filled" | "cancelled";
export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  is_admin: boolean;
  is_premium: boolean;
  premium_until: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Instrument {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  bio: string | null;
  experience: ExperienceLevel;
  city: string | null;
  state: string | null;
  availability: string | null;
  rate_min: number | null;
  rate_max: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Gig {
  id: string;
  posted_by: string;
  title: string;
  description: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  gig_date: string;
  start_time: string | null;
  end_time: string | null;
  budget: number | null;
  musicians_needed: number;
  status: GigStatus;
  is_featured: boolean;
  featured_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface GigInstrument {
  id: string;
  gig_id: string;
  instrument_id: string;
  quantity: number;
}

export interface Application {
  id: string;
  gig_id: string;
  musician_id: string;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

// Composite types for joined queries
export interface ProfileFull extends Profile {
  instruments: Instrument[];
  genres: Genre[];
  user: Pick<User, "full_name" | "avatar_url" | "email">;
}

export interface GigFull extends Gig {
  instruments: (GigInstrument & { instrument: Instrument })[];
  genres: Genre[];
  posted_by_user: Pick<User, "full_name" | "avatar_url">;
  application_count?: number;
}

export interface ApplicationFull extends Application {
  gig: Pick<Gig, "id" | "title" | "gig_date" | "venue" | "city" | "status">;
  musician: Pick<User, "id" | "full_name" | "avatar_url"> & {
    profile: Pick<Profile, "id" | "bio" | "experience"> | null;
  };
}
