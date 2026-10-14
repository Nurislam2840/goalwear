// src/app/admin/teams/page.tsx
"use client";

import { useState } from "react";
import { useSiteData, Team } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import ThemedSelect from "@/components/ThemedSelect";
import { Plus, Edit3, Trash2, X, Users, Loader2 } from "lucide-react";

const COLOR_OPTIONS = [
  { label: "Blue", value: "from-blue-50 to-white dark:from-blue-900/20 dark:to-brand-card" },
  { label: "Red", value: "from-red-50 to-white dark:from-red-900/20 dark:to-brand-card" },
  { label: "Red-Blue", value: "from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20" },
  { label: "Green", value: "from-green-50 to-white dark:from-green-900/20 dark:to-brand-card" },
  { label: "Yellow", value: "from-yellow-50 to-white dark:from-yellow-900/20 dark:to-brand-card" },
  { label: "Purple", value: "from-purple-50 to-white dark:from-purple-900/20 dark:to-brand-card" },
];

export default function AdminTeamsPage() {
  const { teams, updateTeams } = useSiteData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Team>({
    id: 0,
    name: "",
    logo: "",
    bgColor: COLOR_OPTIONS[0].value,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setEditing(null);
    setFormData({ id: Date.now(), name: "", logo: "", bgColor: COLOR_OPTIONS[0].value });
    setIsModalOpen(true);
  };

  const handleEdit = (t: Team) => {
    setEditing(t);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (editing) {
        updateTeams(teams.map((t) => (t.id === formData.id ? formData : t)));
        showToast("Team updated!", "success");
      } else {
        updateTeams([...teams, formData]);
        showToast("Team added!", "success");
      }
      setIsModalOpen(false);
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (t: Team) => {
    updateTeams(teams.filter((x) => x.id !== t.id));
    showToast("Team deleted!", "success");
    setDeleteConfirm(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Teams</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {teams.length} popular teams
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-5 py-3 rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold dark:text-white mb-1">No teams</h3>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-6 py-2.5 rounded-full mt-4"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teams.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-brand-card rounded-2xl border border-gray-100 dark:border-brand-border p-4 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.logo}
                  alt={t.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/64?text=T";
                  }}
                />
              </div>
              <h3 className="text-sm font-bold dark:text-white line-clamp-1">{t.name}</h3>
              <div className="flex gap-1.5 mt-3">
                <button
                  onClick={() => handleEdit(t)}
                  className="flex-1 p-2 bg-brand-green rounded-lg flex items-center justify-center"
                >
                  <Edit3 className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(t)}
                  className="flex-1 p-2 bg-red-500 rounded-lg flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-lg shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-border">
              <h2 className="text-lg font-bold dark:text-white">
                {editing ? "Edit Team" : "Add Team"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 dark:bg-brand-dark rounded-full"
              >
                <X className="w-4 h-4 dark:text-white" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Real Madrid"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Logo URL *
                </label>
                <input
                  type="url"
                  required
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded-xl text-sm dark:text-white outline-none focus:border-brand-green"
                />
                {formData.logo && (
                  <div className="mt-3 w-20 h-20 mx-auto bg-gray-50 dark:bg-brand-dark rounded-xl overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.logo}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Background Color
                </label>
                {/* 👇 Themed Select instead of native select */}
                <ThemedSelect
                  value={formData.bgColor}
                  onChange={(value) => setFormData({ ...formData, bgColor: value })}
                  options={COLOR_OPTIONS}
                  fullWidth
                />
              </div>
            </form>
            <div className="p-5 border-t border-gray-100 dark:border-brand-border flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-brand-green text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                )}
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          ></div>
          <div className="relative bg-white dark:bg-brand-card rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold dark:text-white text-center mb-2">
              Delete Team?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Delete "{deleteConfirm.name}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}