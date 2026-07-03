import { useRef, useState } from "react";
import { FaCloudUploadAlt, FaFile, FaSpinner } from "react-icons/fa";
import { uploadMedia } from "../../services/api";

export default function FileUploadField({
  label,
  value,
  onChange,
  uploadType = "image",
  required,
  accept,
  compact = false,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isIcon = uploadType === "icon";
  const resolvedType = isIcon ? "icon" : uploadType;

  const defaultAccept = {
    image: "image/jpeg,image/png,image/gif,image/webp,image/svg+xml",
    icon: "image/jpeg,image/png,image/gif,image/webp,image/svg+xml",
    video: "video/mp4,video/webm,video/quicktime",
    file: ".pdf,.doc,.docx,application/pdf",
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const url = await uploadMedia(file, resolvedType);
      onChange(url);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const showImagePreview =
    (uploadType === "image" || isIcon) && value && !value.startsWith("Fa");

  return (
    <div className={compact || isIcon ? "" : "sm:col-span-2"}>
      <label className="text-sm font-medium text-white/90">
        {label}
        {required && <span className="text-portek-green"> *</span>}
      </label>

      <div className="mt-2 rounded-xl border border-dashed border-portek-border bg-portek-bg/50 p-4">
        {showImagePreview && (
          <div className="mb-3">
            <img
              src={value}
              alt="Preview"
              className={`rounded-lg object-contain border border-portek-border bg-white/5 ${
                isIcon ? "w-14 h-14" : "h-32 w-auto max-w-full"
              }`}
            />
          </div>
        )}

        {uploadType === "video" && value && (
          <div className="mb-3">
            <video
              src={value}
              controls
              className="h-32 w-auto max-w-full rounded-lg border border-portek-border"
            />
          </div>
        )}

        {uploadType === "file" && value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 mb-3 text-portek-green text-sm hover:underline"
          >
            <FaFile className="w-4 h-4" />
            View uploaded file
          </a>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept || defaultAccept[resolvedType]}
          onChange={handleFile}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-portek-green/10 border border-portek-green/30 text-portek-green text-sm font-medium hover:bg-portek-green/20 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FaCloudUploadAlt />
              {value ? "Replace" : isIcon ? "Upload icon" : `Upload ${uploadType}`}
            </>
          )}
        </button>

        {value && (
          <p className="mt-2 text-xs text-portek-muted truncate" title={value}>
            {value}
          </p>
        )}

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}
