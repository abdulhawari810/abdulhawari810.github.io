import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectById } from "@/database/projectQueries";

const colorMap = {
  sage: "bg-sage",
  sand: "bg-sand",
  steel: "bg-steel",
};

export default function Detail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const data = await getProjectById(id);
      setProject(data);
      setLoading(false);
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="text-sm text-secondary-text">Loading...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-sm text-secondary-text">Project not found</span>
        <Link
          to="/"
          className="text-sm font-semibold border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 pb-12">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center py-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
        >
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
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          {project.subtitle}
        </Link>
        <Link
          to="/"
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          All work
        </Link>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-custom/30 mb-12"></div>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left - Title */}
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight">
          {project.title}
        </h1>

        {/* Right - Description */}
        <div className="flex items-end">
          <p className="text-sm text-secondary-text leading-relaxed max-w-sm">
            {project.description}
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div
        className={`w-full aspect-[16/9] ${colorMap[project.color] || "bg-sand"} rounded-lg overflow-hidden relative mb-16`}
      >
        {/* Initials */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-background/90 leading-none select-none">
            {project.initials}
          </span>
        </div>

        {/* Label top-left */}
        <span className="absolute top-4 left-4 text-xs font-semibold tracking-[0.15em] uppercase text-background/80">
          Selected Direction / 01
        </span>

        {/* Label bottom-right */}
        <span className="absolute bottom-4 right-4 text-xs font-semibold tracking-[0.15em] uppercase text-background/80">
          {project.label}
        </span>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left - About */}
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-secondary-text">
            About the Project
          </span>
          <p className="text-base md:text-lg font-medium leading-relaxed mt-6">
            {project.description}
          </p>
        </div>

        {/* Right - Services */}
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-secondary-text">
            Project Info
          </span>
          <div className="mt-6">
            {[
              { label: "Client", value: project.client },
              { label: "Year", value: project.year },
              { label: "Role", value: project.role },
              { label: "Duration", value: project.duration },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-4 border-b border-border-custom/30"
              >
                <span className="text-sm text-secondary-text">{item.label}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Preview Link */}
      <div className="flex justify-center mb-16">
        <a
          href={project.demo_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background text-sm font-semibold rounded-full hover:bg-accent transition-colors"
        >
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          View Live Demo
        </a>
      </div>
    </div>
  );
}
