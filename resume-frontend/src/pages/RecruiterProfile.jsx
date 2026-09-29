import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RecruiterProfile() {
  const navigate = useNavigate();

  // ==============================
  // EMPTY FORM
  // ==============================
  const emptyForm = {
    fullName: "",
    phone: "",
    designation: "",
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    companyLocation: "",
    companyLogo: "",
  };

  // ==============================
  // STATES
  // ==============================
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==============================
  // SET PROFILE DATA
  // ==============================
  const setProfileData = (profile) => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      designation: profile.designation || "",
      companyName: profile.companyName || "",
      companyWebsite: profile.companyWebsite || "",
      companyDescription: profile.companyDescription || "",
      companyLocation: profile.companyLocation || "",
      companyLogo: profile.companyLogo || "",
    });
  };

  // ==============================
  // FETCH PROFILE
  // ==============================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/recruiters/profile");

      console.log("🔥 PROFILE GET RESPONSE:", response.data);

      const profile = response.data?.data?.profile;

      if (profile) {
        setProfileData(profile);
      } else {
        setFormData(emptyForm);
      }
    } catch (err) {
      console.error("❌ FETCH PROFILE ERROR:", err);

      if (err.response?.status === 404) {
        setFormData(emptyForm);
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load recruiter profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD PROFILE
  // ==============================
  useEffect(() => {
    fetchProfile();
  }, []);

  // ==============================
  // HANDLE CHANGE
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==============================
  // HANDLE SAVE
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      console.log("🔥 DATA SENT:", formData);

      const response = await api.put(
        "/recruiters/profile",
        formData
      );

      console.log("🔥 SAVE RESPONSE:", response.data);

      if (response.data?.success) {
        setSuccess(
          response.data?.message ||
            "Recruiter profile saved successfully"
        );

        const savedProfile =
          response.data?.data?.profile;

        if (savedProfile) {
          setProfileData(savedProfile);
        } else {
          await fetchProfile();
        }
      } else {
        setError(
          response.data?.message ||
            "Profile was not saved"
        );
      }
    } catch (err) {
      console.error(
        "❌ SAVE RECRUITER PROFILE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save recruiter profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-lg font-medium text-white">
          Loading recruiter profile...
        </div>
      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Recruiter Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your recruiter and company information
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            ← Back
          </button>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-700 bg-green-900/30 px-4 py-3 text-sm text-green-300">
            ✅ {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300">
            ❌ {error}
          </div>
        )}

        {/* FORM CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">

          <form onSubmit={handleSubmit}>

            {/* PERSONAL INFORMATION */}
            <div className="mb-8">
              <h2 className="mb-5 text-xl font-semibold">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* FULL NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                {/* DESIGNATION */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Designation
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. HR Manager"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

              </div>
            </div>

            {/* COMPANY INFORMATION */}
            <div className="mb-8">
              <h2 className="mb-5 text-xl font-semibold">
                Company Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* COMPANY NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                {/* WEBSITE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Company Website
                  </label>

                  <input
                    type="text"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Company Location
                  </label>

                  <input
                    type="text"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="e.g. Nagpur, Maharashtra"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                {/* LOGO */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Company Logo URL
                  </label>

                  <input
                    type="text"
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleChange}
                    placeholder="Enter logo URL"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

              </div>

              {/* DESCRIPTION */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Company Description
                </label>

                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Tell us about your company..."
                  rows={5}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* LOGO PREVIEW */}
            {formData.companyLogo && (
              <div className="mb-8">
                <h2 className="mb-3 text-sm font-medium text-slate-300">
                  Company Logo Preview
                </h2>

                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                  <img
                    src={formData.companyLogo}
                    alt="Company Logo"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={saving}
                className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default RecruiterProfile;