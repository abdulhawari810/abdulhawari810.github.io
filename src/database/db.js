import Dexie from "dexie";

export const db = new Dexie("PortfolioDB");

db.version(1).stores({
  users: "++id, username, email, phone_number, gender, skill, birthday",
  profile: "++id, username, full_name, role, tagline, heading, about_heading, about_description, about, bio, location, experience_years, total_projects, average_rating, email, phone, avatar_url, badge_top, badge_bottom",
  projects: "++id, title, subtitle, year, category, color, initials, label, description, client, role, duration, demo_url, thumbnail_url, created_at",
});
