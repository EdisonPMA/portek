import { useState, useEffect, useCallback } from "react";
import { getAll, create, update, remove } from "../../services/api";
import { useAppSettings } from "../../context/AppSettingsContext";
import PageHeader from "./PageHeader";
import DataTable from "./DataTable";
import Modal from "./Modal";
import FileUploadField from "./FileUploadField";

const inputClass =
  "w-full mt-1 bg-portek-bg border border-portek-border rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-portek-green/50 focus:ring-1 focus:ring-portek-green/30 placeholder:text-portek-muted/50";

const uploadTypes = ["image", "video", "file", "icon"];

function buildEmptyForm(fields) {
  const form = {};
  fields.forEach((f) => {
    if (f.type === "checkbox") form[f.name] = false;
    else form[f.name] = "";
  });
  return form;
}

function EntityForm({ fields, form, onChange, selectOptions }) {
  const { t } = useAppSettings();

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {fields.map((field) => {
        const isFull =
          field.type === "textarea" ||
          (uploadTypes.includes(field.type) && field.type !== "icon");
        const value = form[field.name] ?? "";

        if (uploadTypes.includes(field.type)) {
          return (
            <FileUploadField
              key={field.name}
              label={field.label}
              value={value}
              onChange={(url) => onChange(field.name, url)}
              uploadType={field.type}
              required={field.required}
            />
          );
        }

        if (field.type === "checkbox") {
          return (
            <label
              key={field.name}
              className={`flex items-center gap-2 text-sm text-white/90 ${isFull ? "sm:col-span-2" : ""}`}
            >
              <input
                type="checkbox"
                checked={!!form[field.name]}
                onChange={(e) => onChange(field.name, e.target.checked)}
                className="rounded border-portek-border bg-portek-bg text-portek-green focus:ring-portek-green"
              />
              {field.label}
            </label>
          );
        }

        if (field.type === "select") {
          const options = field.optionsFrom
            ? selectOptions[field.name] || []
            : (field.options || []).map((o) => ({ id: o, label: o }));

          return (
            <div key={field.name} className={isFull ? "sm:col-span-2" : ""}>
              <label className="text-sm font-medium text-white/90">
                {field.label}
                {field.required && <span className="text-portek-green"> *</span>}
              </label>
              <select
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                className={inputClass}
                required={field.required}
              >
                <option value="">{field.placeholder || t("common.select")}</option>
                {options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <div key={field.name} className={isFull ? "sm:col-span-2" : ""}>
            <label className="text-sm font-medium text-white/90">
              {field.label}
              {field.required && <span className="text-portek-green"> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                rows={4}
                placeholder={field.placeholder}
                className={inputClass}
                required={field.required}
              />
            ) : (
              <input
                type={field.type || "text"}
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
                required={field.required && !uploadTypes.includes(field.type)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CrudManager({ config }) {
  const { t } = useAppSettings();
  const { title, subtitle, endpoint, fields, columns } = config;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(buildEmptyForm(fields));
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectOptions, setSelectOptions] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAll(endpoint);
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load data. Check your connection and login.");
    }
    setLoading(false);
  }, [endpoint]);

  const loadSelectOptions = useCallback(async () => {
    const opts = {};
    for (const field of fields) {
      if (field.optionsFrom) {
        try {
          const data = await getAll(field.optionsFrom);
          opts[field.name] = data.map((item) => ({
            id: item.id,
            label: item[field.optionLabel || "name"],
          }));
        } catch {
          opts[field.name] = [];
        }
      }
    }
    setSelectOptions(opts);
  }, [fields]);

  useEffect(() => {
    loadData();
    loadSelectOptions();
  }, [loadData, loadSelectOptions]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(buildEmptyForm(fields));
    setError("");
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    const next = buildEmptyForm(fields);
    fields.forEach((f) => {
      if (f.type === "checkbox") next[f.name] = !!row[f.name];
      else next[f.name] = row[f.name] ?? "";
    });
    setForm(next);
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    for (const field of fields) {
      if (field.required && uploadTypes.includes(field.type) && !form[field.name]) {
        setError(`Please upload ${field.label.toLowerCase()} before saving.`);
        setSaving(false);
        return;
      }
    }

    const payload = { ...form };
    fields.forEach((f) => {
      if (f.type === "number" && payload[f.name] !== "" && payload[f.name] !== null) {
        payload[f.name] = Number(payload[f.name]);
      }
      if (f.optionsFrom && payload[f.name] !== "" && payload[f.name] !== null) {
        payload[f.name] = Number(payload[f.name]);
      }
      if (f.type === "checkbox") {
        payload[f.name] = !!payload[f.name];
      }
      if (payload[f.name] === "") {
        payload[f.name] = f.type === "checkbox" ? false : null;
      }
    });

    try {
      if (editing) {
        await update(endpoint, editing.id, payload);
      } else {
        await create(endpoint, payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || t("admin.failedSave"));
    }
    setSaving(false);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete this ${title.toLowerCase()} record?`)) return;
    try {
      await remove(endpoint, row.id);
      loadData();
    } catch {
      setError(t("admin.failedDelete"));
    }
  };

  const filtered = rows.filter((row) =>
    columns.some((col) =>
      String(row[col] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        buttonText={`Add ${title.slice(0, -1) || title}`}
        onButtonClick={openCreate}
      >
        <input
          type="text"
          placeholder={t("admin.searchRecords")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="hidden sm:block bg-portek-card border border-portek-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-portek-muted outline-none focus:border-portek-green/50 w-56"
        />
      </PageHeader>

      {error && !modalOpen && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-portek-green/30 border-t-portek-green rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? `Edit ${title}` : `Add ${title}`}
        onClose={() => setModalOpen(false)}
        wide
      >
        {error && modalOpen && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <EntityForm
            fields={fields}
            form={form}
            onChange={handleChange}
            selectOptions={selectOptions}
          />
          <div className="flex gap-3 mt-6 pt-4 border-t border-portek-border">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-portek-green text-portek-bg py-2.5 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors disabled:opacity-70"
            >
              {saving ? t("common.saving") : editing ? t("common.update") : t("common.create")}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 rounded-full border border-portek-border text-portek-muted text-sm hover:text-white transition-colors"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
