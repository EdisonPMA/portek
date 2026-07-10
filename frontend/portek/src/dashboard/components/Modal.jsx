export default function Modal({ open, title, onClose, children, wide }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-portek-border bg-portek-card shadow-2xl`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-portek-border bg-portek-card px-5 sm:px-6 py-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-portek-muted hover:text-white text-xl leading-none p-1"
          >
            ×
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
