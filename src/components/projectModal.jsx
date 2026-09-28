import { useState, useEffect } from "react";

const colorOptions = [
  { id: "sage", label: "Sage", class: "bg-sage" },
  { id: "sand", label: "Sand", class: "bg-sand" },
  { id: "steel", label: "Steel", class: "bg-steel" },
];

const categoryOptions = ["branding", "product", "web"];

export default function ProjectModal({ isOpen, onClose, onSave, project }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    year: "",
    category: "branding",
    color: "sage",
    initials: "",
    label: "",
    description: "",
    client: "",
    role: "",
    duration: "",
    demo_url: "",
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        title: "",
        subtitle: "",
        year: "",
        category: "branding",
        color: "sage",
        initials: "",
        label: "",
        description: "",
        client: "",
        role: "",
        duration: "",
        demo_url: "",
      });
    }
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border-custom rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-custom">
          <h2 className="text-xl font-bold">
            {project ? "Edit Project" : "Add Project"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-border-custom/20 flex items-center justify-center transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Initials
              </label>
              <input
                type="text"
                name="initials"
                value={formData.initials}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="e.g. RR"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Label
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="e.g. Brand Identity"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-secondary-text mb-1">
              Color
            </label>
            <div className="flex gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, color: color.id }))
                  }
                  className={`w-10 h-10 rounded-lg ${color.class} ${
                    formData.color === color.id
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-secondary-text mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Client
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="e.g. 3 Months"
              />
            </div>
            <div>
              <label className="block text-xs text-secondary-text mb-1">
                Demo URL
              </label>
              <input
                type="url"
                name="demo_url"
                value={formData.demo_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border-custom bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-border-custom rounded-lg text-sm font-medium hover:bg-border-custom/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              {project ? "Update Project" : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
