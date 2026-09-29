import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function UploadResume() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ======================================
  // SELECT FILE
  // ======================================
  const handleFile = (selectedFile) => {
    setError("");
    setResult(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  // ======================================
  // FILE INPUT
  // ======================================
  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  // ======================================
  // DRAG EVENTS
  // ======================================
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];

    handleFile(droppedFile);
  };

  // ======================================
  // UPLOAD
  // ======================================
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume PDF first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setResult(null);

      const formData = new FormData();

      formData.append("resume", file);

      const response = await api.post(
        "/candidates/resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);

    } catch (error) {
      console.error("Resume upload error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.25)] backdrop-blur-xl">

            <span className="text-3xl">
              📄
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Upload Your Resume
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Upload your latest resume and let our ATS engine
            analyze your skills and profile.
          </p>

        </div>

        {/* Main 3D Card */}
        <div className="mx-auto max-w-4xl">

          <div
            className="
              relative
              rounded-[2rem]
              border border-white/10
              bg-white/[0.04]
              p-4
              shadow-2xl
              backdrop-blur-2xl
            "
          >

            {/* 3D Inner Card */}
            <div
              className="
                rounded-[1.7rem]
                border border-indigo-400/10
                bg-gradient-to-br
                from-slate-900/90
                via-slate-900/70
                to-indigo-950/70
                p-6
                shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                sm:p-10
              "
            >

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`
                  group
                  relative
                  cursor-pointer
                  overflow-hidden
                  rounded-3xl
                  border-2
                  border-dashed
                  p-10
                  text-center
                  transition-all
                  duration-300
                  sm:p-16
                  ${
                    dragActive
                      ? "scale-[1.02] border-indigo-400 bg-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.25)]"
                      : "border-slate-700 bg-slate-950/40 hover:border-indigo-500/50 hover:bg-indigo-500/[0.04]"
                  }
                `}
              >

                {/* Upload Icon */}
                <div
                  className="
                    mx-auto
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-indigo-400/20
                    bg-gradient-to-br
                    from-indigo-500/20
                    to-purple-500/10
                    shadow-[0_20px_50px_rgba(79,70,229,0.25)]
                    transition
                    duration-300
                    group-hover:-translate-y-2
                    group-hover:rotate-2
                  "
                >
                  <span className="text-5xl">
                    📤
                  </span>
                </div>

                <h2 className="mt-7 text-xl font-semibold text-white">
                  {file
                    ? file.name
                    : "Drop your resume here"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {file
                    ? `${(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB`
                    : "or click to browse from your computer"}
                </p>

                <div className="mt-5 flex justify-center gap-2">

                  <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                    PDF
                  </span>

                  <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                    Max 5 MB
                  </span>

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  ⚠️ {error}
                </div>
              )}

              {/* Selected File */}
              {file && !result && (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-xl">
                        📄
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              )}

              {/* Upload Button */}
              {!result && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={!file || uploading}
                  className="
                    mt-7
                    w-full
                    rounded-xl
                    bg-gradient-to-r
                    from-indigo-600
                    via-indigo-500
                    to-purple-600
                    px-6
                    py-3.5
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-indigo-600/20
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-indigo-500/30
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  {uploading
                    ? "⏳ Analyzing Resume..."
                    : "🚀 Upload & Analyze Resume"}
                </button>
              )}

              {/* Success */}
              {result?.success && (
                <div className="mt-8">

                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] p-7 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl">
                      ✓
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-white">
                      Resume Uploaded Successfully
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      Your resume has been analyzed successfully.
                    </p>

                  </div>

                  {/* Skills */}
                  {result.data?.extractedSkills?.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">

                      <h3 className="text-lg font-semibold text-white">
                        🧠 Extracted Skills
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {result.data.extractedSkills.map(
                          (skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="
                                rounded-full
                                border
                                border-indigo-500/20
                                bg-indigo-500/10
                                px-3
                                py-1.5
                                text-sm
                                text-indigo-300
                              "
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>
                  )}

                  {/* Resume Info */}
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Resume
                      </p>

                      <p className="mt-2 truncate text-sm font-medium text-white">
                        {result.data?.resume?.fileName}
                      </p>

                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Extracted Text
                      </p>

                      <p className="mt-2 text-xl font-bold text-indigo-400">
                        {result.data?.resumeTextLength || 0}
                        <span className="ml-1 text-sm font-normal text-slate-500">
                          characters
                        </span>
                      </p>

                    </div>

                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                    <button
                      onClick={() => {
                        setFile(null);
                        setResult(null);
                      }}
                      className="flex-1 rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-200 hover:bg-slate-800"
                    >
                      Upload Another
                    </button>

                    <button
                      onClick={() =>
                        navigate("/candidate/jobs")
                      }
                      className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-500"
                    >
                      Browse Jobs →
                    </button>

                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <div className="text-xl">🔒</div>
              <p className="mt-2 text-sm font-medium text-slate-300">
                Secure Upload
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Your resume stays protected
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <div className="text-xl">🧠</div>
              <p className="mt-2 text-sm font-medium text-slate-300">
                ATS Analysis
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Skills automatically extracted
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <div className="text-xl">⚡</div>
              <p className="mt-2 text-sm font-medium text-slate-300">
                Fast Processing
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Results in seconds
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default UploadResume;