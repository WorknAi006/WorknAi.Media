"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Briefcase,
  UserCheck,
  Edit2,
  Trash2,
  Key,
  Mail,
  User,
  X,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "client";
  password?: string;
  created_at?: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee" as "admin" | "employee" | "client",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (hasBody = false): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (hasBody) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // 1. Fetch all users from Backend API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/users`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
      }
    } catch (err: any) {
      console.error("Failed to load users:", err);
      showToast("Error connecting to users service");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open modal for adding
  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "employee",
      password: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || "employee",
      password: user.password || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Submit create / update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Name and Email are required");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      if (editingUser) {
        // UPDATE user
        const res = await fetch(`${apiBase}/users/${editingUser.id}`, {
          method: "PUT",
          headers: getHeaders(true),
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`User "${formData.name}" updated successfully ✅`);
          setIsModalOpen(false);
          fetchUsers();
        } else {
          setFormError(json.error || json.message || "Failed to update user");
        }
      } else {
        // CREATE user
        const res = await fetch(`${apiBase}/users`, {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`User "${formData.name}" created successfully ✅`);
          setIsModalOpen(false);
          fetchUsers();
        } else {
          setFormError(json.error || json.message || "Failed to create user");
        }
      }
    } catch (err: any) {
      setFormError(err.message || "Request failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!deletingUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/users/${deletingUser.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`User "${deletingUser.name}" deleted successfully 🗑️`);
        setDeletingUser(null);
        fetchUsers();
      } else {
        showToast(json.error || "Failed to delete user");
      }
    } catch (err: any) {
      showToast("Error deleting user: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Metric counts
  const stats = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      employee: users.filter((u) => u.role === "employee").length,
      client: users.filter((u) => u.role === "client").length,
    };
  }, [users]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-500/40 bg-[#0B1020]/95 px-5 py-3 text-xs font-semibold text-white shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Users className="h-3.5 w-3.5" />
            <span>User Management CRUD</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            User Accounts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create, update, manage role permissions, and access credentials for agency personnel and clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition hover:bg-blue-500 active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">Admins</span>
            <Shield className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-300">{stats.admin}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300">Employees</span>
            <Briefcase className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-300">{stats.employee}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">Clients</span>
            <UserCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-300">{stats.client}</p>
        </div>
      </div>

      {/* Search & Role Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mr-1">Role:</span>
          {["all", "admin", "employee", "client"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                roleFilter === r
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500/50"
                  : "bg-white/5 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Password</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-400 mb-2" />
                    <span>Loading users from database...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="text-xs text-zinc-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          u.role === "admin"
                            ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                            : u.role === "client"
                            ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                            : "border border-purple-500/30 bg-purple-500/10 text-purple-300"
                        }`}
                      >
                        {u.role === "admin" && <Shield className="h-3 w-3" />}
                        {u.role === "employee" && <Briefcase className="h-3 w-3" />}
                        {u.role === "client" && <UserCheck className="h-3 w-3" />}
                        <span>{u.role || "employee"}</span>
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-xs text-zinc-400">
                        {u.password ? "••••••••" : "Not set"}
                      </span>
                    </td>

                    <td className="p-4 text-xs text-zinc-400">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          title="Edit User"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:border-blue-500/50 hover:bg-blue-600/20 hover:text-white transition"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingUser(u)}
                          title="Delete User"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:border-red-500/50 hover:bg-red-500/20 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0B1020] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {editingUser ? "Edit User Account" : "Create New User"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@worknai.media"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Role & Permissions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: "employee", label: "Employee", color: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
                      { role: "admin", label: "Admin", color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
                      { role: "client", label: "Client", color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.role}
                        onClick={() => setFormData({ ...formData, role: item.role as any })}
                        className={`rounded-xl border py-2 text-xs font-semibold transition ${
                          formData.role === item.role
                            ? `${item.color} shadow-sm ring-1 ring-white/20`
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Account Password {editingUser && <span className="text-zinc-500 font-normal">(Leave empty to keep existing)</span>}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={editingUser ? "Leave blank to keep same" : "e.g. securePass123"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-9 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-blue-500 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span>{editingUser ? "Save Changes" : "Create Account"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl border border-red-500/30 bg-[#0B1020] p-6 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
                <Trash2 className="h-6 w-6" />
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                Delete User Account?
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                Are you sure you want to delete <span className="text-white font-semibold">{deletingUser.name}</span> ({deletingUser.email})? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:bg-red-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
