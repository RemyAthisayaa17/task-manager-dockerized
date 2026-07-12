import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  ReactNode,
  useState,
} from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            style={isPassword ? { WebkitTextSecurity: undefined } : undefined}
            className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-800
              placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
              disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
              transition-colors
              ${error ? "border-red-400 focus:ring-red-400/40 focus:border-red-400" : "border-slate-300"}
              ${isPassword ? "pr-10" : ""}
              ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-800
          placeholder-slate-400 resize-none
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
          disabled:bg-slate-50 disabled:text-slate-400
          transition-colors
          ${error ? "border-red-400 focus:ring-red-400/40 focus:border-red-400" : "border-slate-300"}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-800
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
          disabled:bg-slate-50 disabled:text-slate-400
          transition-colors
          ${error ? "border-red-400 focus:ring-red-400/40 focus:border-red-400" : "border-slate-300"}
          ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 border border-indigo-600 hover:border-indigo-700",
  secondary:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-400 disabled:text-slate-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 border border-red-600 hover:border-red-700",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400 disabled:text-slate-300 border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2.5 rounded-lg",
  lg: "text-sm px-5 py-3 rounded-lg",
};

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => (
  <button
    disabled={loading || disabled}
    className={`inline-flex items-center justify-center gap-2 font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-1
      transition-all duration-150 disabled:cursor-not-allowed
      ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {loading && (
      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )}
    {children}
  </button>
);

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeColor = "green" | "yellow" | "blue" | "red" | "purple" | "gray" | "indigo";

const badgeColors: Record<BadgeColor, string> = {
  green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  yellow: "bg-amber-50 text-amber-700 border border-amber-200",
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  red: "bg-red-50 text-red-700 border border-red-200",
  purple: "bg-purple-50 text-purple-700 border border-purple-200",
  gray: "bg-slate-100 text-slate-600 border border-slate-200",
  indigo: "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

export const Badge = ({
  color = "gray",
  children,
}: {
  color?: BadgeColor;
  children: ReactNode;
}) => (
  <span
    className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${badgeColors[color]}`}
  >
    {children}
  </span>
);

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ title, subtitle, onClose, children }: ModalProps) => (
  <div
    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in"
    >
      {/* Header — NO X button per spec */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

// ─── Alert ────────────────────────────────────────────────────────────────────

type AlertType = "error" | "success" | "info";

const alertStyles: Record<AlertType, string> = {
  error: "bg-red-50 border-red-200 text-red-700",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  info: "bg-indigo-50 border-indigo-200 text-indigo-700",
};

export const Alert = ({
  type = "error",
  children,
}: {
  type?: AlertType;
  children: ReactNode;
}) => (
  <div
    className={`rounded-lg border px-4 py-3 text-sm font-medium ${alertStyles[type]}`}
    role="alert"
  >
    {children}
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────

export const Spinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
    <svg className="animate-spin h-7 w-7 text-indigo-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <span className="text-sm">{text}</span>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

export const EmptyState = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-1 border border-slate-200">
      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <p className="font-semibold text-slate-700">{title}</p>
    {subtitle && <p className="text-sm text-slate-400 max-w-xs">{subtitle}</p>}
    {action}
  </div>
);