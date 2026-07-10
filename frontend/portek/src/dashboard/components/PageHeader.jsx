import { FaPlus } from "react-icons/fa";

export default function PageHeader({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  buttonIcon = true,
  children,
}) {
  return (
    <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-portek-muted text-sm">{subtitle}</p>}
        </div>

        {buttonText && (
          <button
            onClick={onButtonClick}
            className="inline-flex items-center gap-2 rounded-full bg-portek-green px-5 py-2.5 text-portek-bg text-sm font-semibold hover:bg-portek-green-dim transition-colors self-start sm:self-auto shrink-0"
          >
            {buttonIcon && <FaPlus className="w-3 h-3" />}
            {buttonText}
          </button>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
