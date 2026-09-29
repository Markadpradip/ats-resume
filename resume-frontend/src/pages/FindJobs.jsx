import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function FindJobs() {
  const navigate = useNavigate();

  // ======================================
  // JOB STATES
  // ======================================

  const [jobs, setJobs] = useState([]);

  // Location data
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  // ======================================
  // FILTER STATES
  // ======================================

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("");

  const [skill, setSkill] = useState("");
  const [jobType, setJobType] = useState("");

  // ======================================
  // PAGINATION
  // ======================================

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // ======================================
  // UI STATES
  // ======================================

  const [loading, setLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // FETCH LOCATIONS
  // ======================================

  const fetchLocations = async () => {
    try {
      setLocationsLoading(true);

      const res = await api.get("/jobs/locations");

      console.log("📍 Locations Response:", res.data);

      setCities(res.data.cities || []);
      setCountries(res.data.countries || []);
    } catch (err) {
      console.error("❌ Location Error:", err);

      setCities([]);
      setCountries([]);
    } finally {
      setLocationsLoading(false);
    }
  };

  // ======================================
  // FETCH JOBS
  // ======================================

  const fetchJobs = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
      };

      // ======================================
      // SEARCH
      // ======================================

      if (filters.search?.trim()) {
        params.search = filters.search.trim();
      }

      // ======================================
      // LOCATION FILTER
      // ======================================

      if (
        filters.location &&
        filters.locationType
      ) {
        if (filters.locationType === "CITY") {
          params.city = filters.location;
        }

        if (filters.locationType === "COUNTRY") {
          params.country = filters.location;
        }
      }

      // ======================================
      // SKILL
      // ======================================

      if (filters.skill?.trim()) {
        params.skill = filters.skill.trim();
      }

      // ======================================
      // JOB TYPE
      // ======================================

      if (filters.jobType) {
        params.jobType = filters.jobType;
      }

      console.log("🔎 Search Params:", params);

      const res = await api.get("/jobs", {
        params,
      });

      console.log("📦 Jobs Response:", res.data);

      setJobs(res.data.jobs || []);
      setTotalJobs(res.data.totalJobs || 0);
      setCurrentPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("❌ Fetch Jobs Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load jobs"
      );

      setJobs([]);
      setTotalJobs(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {
    fetchLocations();

    fetchJobs(1, {
      search: "",
      location: "",
      locationType: "",
      skill: "",
      jobType: "",
    });
  }, []);

  // ======================================
  // PAGE CHANGE
  // ======================================

  useEffect(() => {
    if (currentPage === 1) {
      return;
    }

    fetchJobs(currentPage, {
      search,
      location,
      locationType,
      skill,
      jobType,
    });
  }, [currentPage]);

  // ======================================
  // SEARCH
  // ======================================

  const handleSearch = () => {
    setCurrentPage(1);

    fetchJobs(1, {
      search,
      location,
      locationType,
      skill,
      jobType,
    });
  };

  // ======================================
  // LOCATION CHANGE
  // ======================================

  const handleLocationChange = (e) => {
    const value = e.target.value;

    let selectedLocation = "";
    let selectedType = "";

    // ------------------------------
    // ALL LOCATIONS
    // ------------------------------

    if (value === "") {
      selectedLocation = "";
      selectedType = "";
    }

    // ------------------------------
    // CITY
    // ------------------------------

    else if (value.startsWith("CITY:")) {
      selectedLocation = value.replace(
        "CITY:",
        ""
      );

      selectedType = "CITY";
    }

    // ------------------------------
    // COUNTRY
    // ------------------------------

    else if (value.startsWith("COUNTRY:")) {
      selectedLocation = value.replace(
        "COUNTRY:",
        ""
      );

      selectedType = "COUNTRY";
    }

    setLocation(selectedLocation);
    setLocationType(selectedType);
    setCurrentPage(1);

    // Immediately search using selected values
    fetchJobs(1, {
      search,
      location: selectedLocation,
      locationType: selectedType,
      skill,
      jobType,
    });
  };

  // ======================================
  // JOB TYPE CHANGE
  // ======================================

  const handleJobTypeChange = (e) => {
    const value = e.target.value;

    setJobType(value);
    setCurrentPage(1);

    fetchJobs(1, {
      search,
      location,
      locationType,
      skill,
      jobType: value,
    });
  };

  // ======================================
  // CLEAR FILTERS
  // ======================================

  const handleClearFilters = () => {
    setSearch("");
    setLocation("");
    setLocationType("");
    setSkill("");
    setJobType("");
    setCurrentPage(1);

    fetchJobs(1, {
      search: "",
      location: "",
      locationType: "",
      skill: "",
      jobType: "",
    });
  };

  // ======================================
  // ENTER KEY
  // ======================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ======================================
  // JOB TYPE LABEL
  // ======================================

  const getJobTypeLabel = (type) => {
    switch (type) {
      case "FULL_TIME":
        return "Full Time";

      case "PART_TIME":
        return "Part Time";

      case "INTERNSHIP":
        return "Internship";

      case "CONTRACT":
        return "Contract";

      default:
        return type || "Job";
    }
  };

  // ======================================
  // FORMAT LOCATION
  // ======================================

  const getJobLocation = (locationData) => {
    if (!locationData) {
      return "Location not specified";
    }

    if (typeof locationData === "string") {
      return locationData;
    }

    return [
      locationData.city,
      locationData.state,
      locationData.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // ======================================
  // LOADING SCREEN
  // ======================================

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>

            <p className="mt-4 text-slate-400">
              Loading Jobs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            BACK BUTTON
        ====================================== */}

        <div className="mb-6">
          <button
            onClick={() =>
              navigate("/candidate/dashboard")
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-500 hover:bg-slate-800 hover:text-white"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ======================================
            HEADER
        ====================================== */}

        <div>
          <p className="text-sm font-medium text-indigo-400">
            CANDIDATE PORTAL
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Find Your Dream Job
          </h1>

          <p className="mt-2 text-slate-400">
            Search jobs from companies and find the
            right opportunity for your career.
          </p>
        </div>

        {/* ======================================
            SEARCH & FILTERS
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">

          <div className="grid gap-4 lg:grid-cols-4">

            {/* SEARCH */}

            <div className="lg:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Search Jobs
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Search React, MERN, Developer, Company..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

            </div>

            {/* ======================================
                LOCATION
            ====================================== */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Location
              </label>

              <select
                value={
                  locationType && location
                    ? `${locationType}:${location}`
                    : ""
                }
                onChange={handleLocationChange}
                disabled={locationsLoading}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
              >

                {/* ALL */}

                <option value="">
                  {locationsLoading
                    ? "Loading Locations..."
                    : "All Locations"}
                </option>

                {/* ======================================
                    CITIES
                ====================================== */}

                {cities.length > 0 && (
                  <optgroup label="Cities">
                    {cities.map((city) => (
                      <option
                        key={`CITY:${city}`}
                        value={`CITY:${city}`}
                      >
                        {city}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* ======================================
                    COUNTRIES
                ====================================== */}

                {countries.length > 0 && (
                  <optgroup label="Countries">
                    {countries.map((country) => (
                      <option
                        key={`COUNTRY:${country}`}
                        value={`COUNTRY:${country}`}
                      >
                        {country}
                      </option>
                    ))}
                  </optgroup>
                )}

              </select>

            </div>

            {/* ======================================
                JOB TYPE
            ====================================== */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Job Type
              </label>

              <select
                value={jobType}
                onChange={handleJobTypeChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
              >

                <option value="">
                  All Job Types
                </option>

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

          {/* ======================================
              SKILL + BUTTONS
          ====================================== */}

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            {/* SKILL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Skill
              </label>

              <input
                type="text"
                value={skill}
                onChange={(e) =>
                  setSkill(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="React, Node.js, MongoDB..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex items-end gap-3 md:col-span-2">

              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Searching..."
                  : "Search Jobs"}
              </button>

              <button
                onClick={handleClearFilters}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-700"
              >
                Clear
              </button>

            </div>

          </div>

        </div>

        {/* ======================================
            RESULT COUNT
        ====================================== */}

        <div className="mt-6 flex items-center justify-between">

          <p className="text-sm text-slate-400">

            <span className="font-semibold text-white">
              {totalJobs}
            </span>{" "}
            jobs found

          </p>

          {loading && (
            <p className="text-sm text-indigo-400">
              Updating jobs...
            </p>
          )}

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ======================================
            JOBS
        ====================================== */}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">

          {jobs.map((job) => (

            <div
              key={job._id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg transition hover:-translate-y-1 hover:border-indigo-500/60"
            >

              {/* HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-xl font-semibold text-white">
                    {job.title}
                  </h2>

                  <p className="mt-1 text-indigo-400">
                    {job.company}
                  </p>

                </div>

                <span className="whitespace-nowrap rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                  {getJobTypeLabel(job.jobType)}
                </span>

              </div>

              {/* DESCRIPTION */}

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                {job.description}
              </p>

              {/* SKILLS */}

              {job.skills?.length > 0 && (

                <div className="mt-4 flex flex-wrap gap-2">

                  {job.skills.map(
                    (skillItem, index) => (

                      <span
                        key={`${skillItem}-${index}`}
                        className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
                      >
                        {skillItem}
                      </span>

                    )
                  )}

                </div>

              )}

              {/* JOB INFORMATION */}

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">

                {/* LOCATION */}

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 font-medium text-slate-200">
                    📍 {getJobLocation(job.location)}
                  </p>

                </div>

                {/* SALARY */}

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Salary
                  </p>

                  <p className="mt-1 font-medium text-slate-200">
                    {job.salary || "Not specified"}
                  </p>

                </div>

              </div>

              {/* FOOTER */}

              <div className="mt-6 flex items-center justify-between gap-4">

                <p className="truncate text-xs text-slate-500">

                  Recruiter:{" "}

                  {job.recruiter?.name ||
                    "Company Recruiter"}

                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/candidate/jobs/${job._id}`
                    )
                  }
                  className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                  View Details
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* ======================================
            NO JOBS
        ====================================== */}

        {!loading && jobs.length === 0 && (

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 py-16 text-center">

            <div className="text-5xl">
              🔍
            </div>

            <h2 className="mt-4 text-xl font-semibold text-white">
              No Jobs Found
            </h2>

            <p className="mt-2 text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={handleClearFilters}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Clear Filters
            </button>

          </div>

        )}

        {/* ======================================
            PAGINATION
        ====================================== */}

        {totalPages > 1 && (

          <div className="mt-8 flex items-center justify-center gap-3">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (prev) => prev - 1
                )
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <div className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (prev) => prev + 1
                )
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>

          </div>

        )}

      </main>

    </div>
  );
}

export default FindJobs;