import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar";
import ProjectModal from "@/components/projectModal";
import {
  getAllProjects,
  getProfile,
  createProject,
  updateProject,
  deleteProject,
  updateProfile,
} from "@/database/projectQueries";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [profileForm, setProfileForm] = useState({
    username: "",
    full_name: "",
    role: "",
    location: "",
    tagline: "",
    heading: "",
    email: "",
    phone: "",
    about: "",
    bio: "",
  });

  useEffect(() => {
    async function fetchData() {
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
          email: profileData.email || "",
          phone: profileData.phone || "",
          about: profileData.about || "",
          bio: profileData.bio || "",
        });
      }
    }
    fetchData();
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
    }
  };

  const handleDeleteProject = async (id) => {
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
    }
  };

  // ==================== PROFILE UPDATE ====================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        ...profile,
        username: profileForm.username,
        full_name: profileForm.full_name,
        role: profileForm.role,
        location: profileForm.location,
        tagline: profileForm.tagline,
        heading: profileForm.heading,
        email: profileForm.email,
        phone: profileForm.phone,
        about: profileForm.about,
        bio: profileForm.bio,
      });
      toast.success("Profile updated successfully!", {
        description: "Your profile has been saved.",
      });
    } catch (error) {
      toast.error("Failed to update profile", {
        description: "Something went wrong. Please try again.",
      });
    }
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
      <Sidebar profile={profile} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-border-custom">
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Good morning, {profile?.full_name || "Ardi"}.
          </h1>
          <button className="w-10 h-10 rounded-full border border-border-custom flex items-center justify-center hover:bg-border-custom/20 transition-colors">
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
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
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
                className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                + Add Project
              </button>
            </div>

            <div className="bg-background border border-border-custom rounded-lg overflow-hidden">
              {projects.length === 0 ? (
                <div className="p-8 text-center text-secondary-text">
                  No projects yet. Click "+ Add Project" to create one.
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
                        className="p-2 hover:bg-border-custom/20 rounded-lg transition-colors"
                        title="Edit"
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-2 hover:bg-red-600/10 text-red-600 rounded-lg transition-colors"
                        title="Delete"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

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
                  className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm min-h-[80px]"
                />
              </div>
              <div className="mb-6">
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
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                Save Changes
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
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
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
