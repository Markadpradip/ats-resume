import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/RecruiterNavbar";
import api from "../services/api";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    skills: "",
    country: "",
    state: "",
    city: "",
    salary: "",
    jobType: "FULL_TIME",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (
      !formData.title ||
      !formData.company ||
      !formData.description ||
      !formData.country ||
      !formData.state ||
      !formData.city
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        skills: skillsArray,

        location: {
          country: formData.country,
          state: formData.state,
          city: formData.city,
        },

        salary: formData.salary,
        jobType: formData.jobType,
      };

      const res = await api.post("/jobs", payload);

      if (res.data.success) {
        setSuccess("Job created successfully!");

        setFormData({
          title: "",
          company: "",
          description: "",
          skills: "",
          country: "",
          state: "",
          city: "",
          salary: "",
          jobType: "FULL_TIME",
        });

        setTimeout(() => {
          navigate("/recruiter/dashboard");
        }, 1200);
      }
    } catch (err) {
      console.error("Create Job Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-indigo-400">
            RECRUITER PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Create New Job
          </h1>

          <p className="mt-2 text-slate-400">
            Post a new job opportunity for candidates.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >

          {/* Job Information */}
          <div>
            <h2 className="text-lg font-semibold">
              Job Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              {/* Job Title */}
              <div>
                <label className="text-sm text-slate-300">
                  Job Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. MERN Stack Developer"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              {/* Company */}
              <div>
                <label className="text-sm text-slate-300">
                  Company *
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. ABC Technologies"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="text-sm text-slate-300">
                  Salary
                </label>

                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹5 - ₹8 LPA"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="text-sm text-slate-300">
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="FULL_TIME">
                    Full Time
                  </option>

                  <option value="PART_TIME">
                    Part Time
                  </option>

                  <option value="INTERNSHIP">
                    Internship
                  </option>

                  <option value="CONTRACT">
                    Contract
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-slate-300">
              Job Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe the job responsibilities, requirements, experience..."
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm text-slate-300">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Express"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Separate skills using commas.
            </p>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold">
              Job Location
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the country, state and city where the
              job is located.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              {/* Country */}
              <div>
                <label className="text-sm text-slate-300">
                  Country *
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. India"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              {/* State */}
              <div>
                <label className="text-sm text-slate-300">
                  State / Region *
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="text-sm text-slate-300">
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Nagpur"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/recruiter/dashboard")
              }
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Job..."
                : "Create Job"}
            </button>

          </div>

        </form>
      </main>
    </div>
  );
}

export default CreateJob;