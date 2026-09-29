import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllProjects, getProfile } from "@/database/firestoreQueries";

const colorMap = {
  sage: "bg-sage",
  sand: "bg-sand",
  steel: "bg-steel",
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [projectsData, profileData] = await Promise.all([
        getAllProjects(),
        getProfile(),
      ]);
      setProjects(projectsData);
      setProfile(profileData);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Extract unique categories from projects
  const categories = useMemo(() => {
    const cats = projects.map((p) => p.category).filter(Boolean);
    return [...new Set(cats)];
  }, [projects]);

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="text-sm text-secondary-text">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 pb-12">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          {/* Top Row */}
          <div className="flex justify-between items-center py-4 md:py-6 mb-4 md:mb-8">
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.15em] md:tracking-[0.2em] uppercase text-secondary-text">
              {profile?.role || "Independent UI/UX Designer"}
            </span>
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.15em] md:tracking-[0.2em] uppercase text-secondary-text">
              {profile?.location || "Jakarta / Indonesia"}
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-xs md:text-sm font-medium tracking-wide uppercase mb-4 md:mb-6 max-w-md leading-relaxed">
            {profile?.tagline ||
              "Crafting intuitive, user-friendly experiences through wireframing, prototyping, and visual design."}
          </p>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight mb-4 md:mb-6">
            {profile?.heading ? (
              <>
                {profile.heading.split(" ").slice(0, -1).join(" ")}
                <br />
                <span className="font-serif italic font-normal normal-case text-4xl md:text-6xl lg:text-7xl">
                  {profile.heading.split(" ").slice(-1)}
                </span>
              </>
            ) : (
              <>
                Design
                <br />
                That
                <br />
                <span className="font-serif italic font-normal normal-case text-4xl md:text-6xl lg:text-7xl">
                  feels human.
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-xs md:text-sm text-secondary-text max-w-sm leading-relaxed mb-6 md:mb-8">
            {profile?.about ||
              "I build clear identities and digital products for ambitious people with something meaningful to say."}
          </p>

          {/* CTA Link */}
          <a
            href="#work"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors w-fit"
          >
            Explore selected work
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        {/* Right - Artwork Panel */}
        <div className="relative">
          <div className="w-full h-full min-h-[300px] md:min-h-[400px] bg-panel rounded-lg overflow-hidden relative">
            {/* Red Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-accent/90">
              {/* Profile Image or Letter A */}
              <div className="absolute inset-0 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-panel leading-none select-none">
                    A
                  </span>
                )}
              </div>
            </div>

            {/* Badge - Top Right */}
            {profile?.badge_top && (
              <div className="absolute top-4 md:top-8 right-4 md:right-8 bg-on-panel text-panel text-xs font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                {profile.badge_top}
              </div>
            )}

            {/* Badge - Bottom Left */}
            {profile?.badge_bottom && (
              <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 bg-on-panel text-panel text-xs font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                {profile.badge_bottom}
              </div>
            )}

            {/* Decorative ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full border border-on-panel/30"></div>
          </div>

          {/* Label under artwork */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-semibold tracking-[0.15em] uppercase">
              Selected
            </span>
            <span className="text-xs text-secondary-text tracking-[0.15em] uppercase">
              Direction / 01
            </span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border-custom/30">
        <div>
          <span className="text-3xl md:text-5xl font-black">
            {String(profile?.experience_years || 7).padStart(2, "0")}
          </span>
          <p className="text-[10px] md:text-xs text-secondary-text tracking-[0.1em] md:tracking-[0.15em] uppercase mt-1 md:mt-2 whitespace-nowrap">
            Years of Experience
          </p>
        </div>
        <div>
          <span className="text-3xl md:text-5xl font-black">
            {profile?.total_projects || 120}
            <span className="text-accent">.</span>
          </span>
          <p className="text-[10px] md:text-xs text-secondary-text tracking-[0.1em] md:tracking-[0.15em] uppercase mt-1 md:mt-2 whitespace-nowrap">
            Total Projects
          </p>
        </div>
        <div>
          <span className="text-3xl md:text-5xl font-black">
            {profile?.average_rating?.toFixed(2) || "5.00"}
          </span>
          <p className="text-[10px] md:text-xs text-secondary-text tracking-[0.1em] md:tracking-[0.15em] uppercase mt-1 md:mt-2 whitespace-nowrap">
            Average Rating
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-16 md:mt-20 py-12 md:py-16" id="about">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-secondary-text">
            02 / A Little About Me
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-custom/30 mb-12"></div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            {profile?.about_heading ? (
              <>
                {profile.about_heading.split(". ").slice(0, -1).join(". ")}.
                <br />
                <span className="font-serif italic font-normal">
                  {profile.about_heading.split(". ").slice(-1)}
                </span>
              </>
            ) : (
              <>
                Good design is quiet.
                <br />
                <span className="font-serif italic font-normal">
                  It stays with you.
                </span>
              </>
            )}
          </h2>

          {/* Right - Description */}
          <div className="flex flex-col justify-center">
            {profile?.about_description ? (
              profile.about_description.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm text-secondary-text leading-relaxed mb-6"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="text-sm text-secondary-text leading-relaxed mb-6">
                  {profile?.about ||
                    "I'm Ardi, a multidisciplinary designer focused on identity, interfaces, and the small details between them."}
                </p>
                <p className="text-sm text-secondary-text leading-relaxed mb-8">
                  {profile?.bio ||
                    "For the last 7 years, I've partnered with people who care deeply about what they make — from early-stage founders to teams building for millions."}
                </p>
              </>
            )}

            {/* CTA Link */}
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-semibold border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors w-fit"
            >
              More about me
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Selected Works Section */}
      <div className="mt-16 md:mt-20 py-12 md:py-16" id="work">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-secondary-text">
            01 / Selected Work
          </span>
          <span className="text-xs text-secondary-text tracking-[0.2em] uppercase">
            ({String(filteredProjects.length).padStart(2, "0")})
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-custom/30 mb-6"></div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 md:px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === "all"
                ? "bg-foreground text-background"
                : "border border-border-custom/50 text-secondary-text hover:border-foreground hover:text-foreground"
            }`}
          >
            Semua Karya
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 md:px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === cat
                  ? "bg-foreground text-background"
                  : "border border-border-custom/50 text-secondary-text hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Link
              to={`/detail/${project.id}`}
              key={project.id}
              className="group cursor-pointer"
            >
              {/* Card Preview */}
              <div
                className={`${
                  colorMap[project.color] || "bg-sage"
                } aspect-[4/5] rounded-lg mb-4 relative overflow-hidden`}
              >
                {/* Number */}
                <span className="absolute top-4 left-4 text-xs font-semibold text-background/80">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Thumbnail or Initials */}
                {project.thumbnail_url ? (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl md:text-8xl font-black text-background/90 group-hover:scale-110 transition-transform duration-300">
                      {project.initials}
                    </span>
                  </div>
                )}

                {/* Label */}
                <span className="absolute bottom-4 right-4 text-xs font-semibold tracking-[0.15em] uppercase text-background/80">
                  {project.label}
                </span>
              </div>

              {/* Card Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-secondary-text">
                    {project.subtitle}
                  </p>
                </div>
                <span className="text-sm text-secondary-text">
                  {project.year}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-16 md:mt-20 py-12 md:py-16" id="contact">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-secondary-text">
            03 / Get in Touch
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-custom/30 mb-12"></div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            Have something
            <br />
            <span className="font-serif italic font-normal">in mind?</span>
          </h2>

          {/* Right - Email */}
          <div className="flex flex-col justify-center items-start lg:items-end">
            <a
              href={`mailto:${profile?.email || "hello@ardipratama.studio"}`}
              className="inline-flex items-center gap-2 text-base md:text-lg font-semibold border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              {profile?.email || "hello@ardipratama.studio"}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
