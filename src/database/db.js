import Dexie from "dexie";

export const db = new Dexie("PortfolioDB");

db.version(1).stores({
  users: "++id, username, email, phone_number, gender, skill, birthday",
  profile: "++id, username, full_name, role, tagline, heading, about, bio, location, experience_years, total_projects, average_rating, email, phone",
  projects: "++id, title, subtitle, year, category, color, initials, label, description, client, role, duration, demo_url, created_at",
});
