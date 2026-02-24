import type { ReactNode } from "react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: EmptyStateAction;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {icon && (
        <div className="mb-4 text-navy-400 dark:text-navy-500 [&_svg]:size-12">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-navy-800 dark:text-navy-100">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-navy-400">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={[
            "rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
            "bg-amber-accent text-white hover:bg-amber-dark",
            "focus:outline-none focus:ring-2 focus:ring-amber-accent focus:ring-offset-2",
            "dark:focus:ring-offset-navy-900",
          ].join(" ")}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
