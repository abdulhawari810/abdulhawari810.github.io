import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Sidebar from "@/components/sidebar";
import ProjectModal from "@/components/projectModal";
import {
  getAllProjects,
  getProfile,
  createProject,
  updateProject,
  deleteProject,
  updateProfile,
} from "@/database/firestoreQueries";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return "Good night";
  }
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: "",
    full_name: "",
    role: "",
    location: "",
    tagline: "",
    heading: "",
    about_heading: "",
    experience_years: "",
    total_projects: "",
    average_rating: "",
    email: "",
    phone: "",
    about: "",
    bio: "",
    avatar_url: "",
    badge_top: "",
    badge_bottom: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [projectsData, profileData] = await Promise.all([
          getAllProjects(),
          getProfile(),
        ]);
        setProjects(projectsData);
        setProfile(profileData);
        if (profileData) {
          setProfileForm({
            username: profileData.username || "",
            full_name: profileData.full_name || "",
            role: profileData.role || "",
            location: profileData.location || "",
            tagline: profileData.tagline || "",
            heading: profileData.heading || "",
            about_heading: profileData.about_heading || "",
            experience_years: profileData.experience_years || "",
            total_projects: profileData.total_projects || "",
            average_rating: profileData.average_rating || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            about: profileData.about || "",
            bio: profileData.bio || "",
            avatar_url: profileData.avatar_url || "",
            badge_top: profileData.badge_top || "",
            badge_bottom: profileData.badge_bottom || "",
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
        toast.error("Failed to load data", {
          description: err.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".relative")) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!", {
      description: "See you soon!",
    });
    navigate("/login");
  };

  // ==================== PROJECT CRUD ====================

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (formData) => {
    setSavingProject(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        toast.success("Project updated successfully!", {
          description: `"${formData.title}" has been updated.`,
        });
      } else {
        await createProject(formData);
        toast.success("Project added successfully!", {
          description: `"${formData.title}" has been added to your portfolio.`,
        });
      }
      const updatedProjects = await getAllProjects();
      setProjects(updatedProjects);
    } catch (error) {
      toast.error("Failed to save project", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    setDeletingProject(true);
    try {
      const project = projects.find((p) => p.id === id);
      await deleteProject(id);
      const updatedProjects = await getAllProjects();
      setProjects(updatedProjects);
      setDeleteConfirm(null);
      toast.success("Project deleted successfully!", {
        description: `"${project?.title}" has been removed.`,
      });
    } catch (error) {
      toast.error("Failed to delete project", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setDeletingProject(false);
    }
  };

  // ==================== PROFILE UPDATE ====================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({
        ...profile,
        username: profileForm.username,
        full_name: profileForm.full_name,
        role: profileForm.role,
        location: profileForm.location,
        tagline: profileForm.tagline,
        heading: profileForm.heading,
        about_heading: profileForm.about_heading,
        experience_years: Number(profileForm.experience_years) || 0,
        total_projects: Number(profileForm.total_projects) || 0,
        average_rating: Number(profileForm.average_rating) || 0,
        email: profileForm.email,
        phone: profileForm.phone,
        about: profileForm.about,
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url,
        badge_top: profileForm.badge_top,
        badge_bottom: profileForm.badge_bottom,
      });
      toast.success("Profile updated successfully!", {
        description: "Your profile has been saved.",
      });
    } catch (error) {
      toast.error("Failed to update profile", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleImageUrlChange = (e) => {
    setProfileForm((prev) => ({
      ...prev,
      avatar_url: e.target.value,
    }));
  };

  const stats = [
    {
      label: "Total Projects",
      value: String(projects.length).padStart(2, "0"),
    },
    { label: "Total Views", value: "1,284" },
    { label: "Total Likes", value: "08" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border-custom)",
          },
        }}
      />
      <Sidebar profile={profile} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-border-custom">
          <h1 className="text-3xl font-black uppercase tracking-tight">
            {getGreeting()}, {profile?.full_name || "Ardi"}.
          </h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full border border-border-custom flex items-center justify-center hover:bg-border-custom/20 transition-colors"
            >
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border-custom rounded-lg shadow-lg z-50 overflow-hidden">
                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-border-custom/20 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isDark ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.364-6.364l-1.06 1.06M6.696 17.304l-1.06 1.06m12.728 0l-1.06-1.06M6.696 6.696l-1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    )}
                  </svg>
                  <span>Dark Mode</span>
                  <span className="ml-auto text-xs text-secondary-text">
                    {isDark ? "On" : "Off"}
                  </span>
                </button>

                {/* Divider */}
                <div className="h-px bg-border-custom"></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-colors"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Keluar Akun</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-border-custom border-t-foreground rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-secondary-text">Loading data...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Failed to load data</h3>
              <p className="text-sm text-secondary-text mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Stats Cards */}
              <div
                id="overview"
                className="grid grid-cols-3 gap-6 mb-12 scroll-mt-8"
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-background border border-border-custom rounded-lg p-6"
                  >
                    <span className="text-4xl font-black">{stat.value}</span>
                    <p className="text-xs text-secondary-text tracking-[0.15em] uppercase mt-2">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Projects Section */}
              <div id="projects" className="mb-12 scroll-mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Projects</h2>
                  <button
                    onClick={handleAddProject}
                    disabled={savingProject}
                    className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {savingProject ? (
                      <>
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      "+ Add Project"
                    )}
                  </button>
                </div>

                <div className="bg-background border border-border-custom rounded-lg overflow-hidden">
                  {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-16 h-16 rounded-full bg-border-custom/20 flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-secondary-text"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                      <p className="text-sm text-secondary-text mb-4">
                        Get started by creating your first project
                      </p>
                      <button
                        onClick={handleAddProject}
                        className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                      >
                        + Add Project
                      </button>
                    </div>
                  ) : (
                    projects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`flex items-center justify-between p-4 hover:bg-border-custom/10 transition-colors ${
                      index !== projects.length - 1
                        ? "border-b border-border-custom"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-background font-bold text-sm ${
                          project.color === "sage"
                            ? "bg-sage"
                            : project.color === "sand"
                              ? "bg-sand"
                              : "bg-steel"
                        }`}
                      >
                        {project.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-xs text-secondary-text">
                          {project.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-secondary-text">
                        {project.year}
                      </span>
                      <button
                        onClick={() => handleEditProject(project)}
                        disabled={savingProject}
                        className="p-2 hover:bg-border-custom/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit"
                      >
                        {savingProject && editingProject?.id === project.id ? (
                          <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
                        ) : (
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        disabled={deletingProject}
                        className="p-2 hover:bg-danger/10 text-danger rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        {deletingProject ? (
                          <div className="w-4 h-4 border-2 border-danger border-t-transparent rounded-full animate-spin"></div>
                        ) : (
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
            </>
          )}

          {/* Profile Section */}
          <div id="profile" className="scroll-mt-8">
            <h2 className="text-xl font-bold mb-6">Profile</h2>
            <div className="bg-background border border-border-custom rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={profileForm.role}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs text-secondary-text mb-1">
                  Tagline
                </label>
                <textarea
                  name="tagline"
                  value={profileForm.tagline}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm min-h-[60px]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-secondary-text mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={profileForm.heading}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={profileForm.experience_years}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Total Projects
                  </label>
                  <input
                    type="number"
                    name="total_projects"
                    value={profileForm.total_projects}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Average Rating
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="average_rating"
                    value={profileForm.average_rating}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs text-secondary-text mb-1">
                  About
                </label>
                <textarea
                  name="about"
                  value={profileForm.about}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm min-h-[120px]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-secondary-text mb-1">
                  About Heading
                </label>
                <input
                  type="text"
                  name="about_heading"
                  value={profileForm.about_heading}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  placeholder="Good design is quiet. It stays with you."
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-secondary-text mb-1">
                  About
                </label>
                <textarea
                  name="about"
                  value={profileForm.about}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm min-h-[80px]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-secondary-text mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm min-h-[80px]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-secondary-text mb-2">
                  Profile Image URL
                </label>
                <div className="flex items-center gap-4">
                  {profileForm.avatar_url && (
                    <img
                      src={profileForm.avatar_url}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border border-border-custom"
                    />
                  )}
                  <input
                    type="url"
                    name="avatar_url"
                    value={profileForm.avatar_url}
                    onChange={handleImageUrlChange}
                    className="flex-1 px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Badge Top Right
                  </label>
                  <input
                    type="text"
                    name="badge_top"
                    value={profileForm.badge_top}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    placeholder="Designer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary-text mb-1">
                    Badge Bottom Left
                  </label>
                  <input
                    type="text"
                    name="badge_bottom"
                    value={profileForm.badge_bottom}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    placeholder="Branding"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="px-6 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-border-custom flex items-center justify-between">
          <span className="text-xs text-secondary-text">
            &copy; {new Date().getFullYear()}{" "}
            {profile?.full_name || "Ardi Pratama"}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-secondary-text hover:text-accent transition-colors"
          >
            Logout
          </button>
        </footer>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border-custom rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-2">Delete Project?</h3>
            <p className="text-sm text-secondary-text mb-6">
              This action cannot be undone. Are you sure you want to delete this
              project?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-border-custom rounded-lg text-sm font-medium hover:bg-border-custom/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirm)}
                className="flex-1 py-2 bg-danger-strong text-white rounded-lg text-sm font-medium hover:brightness-110 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
