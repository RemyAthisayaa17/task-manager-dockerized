import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef } from "react";
import { FiCheckSquare } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/auth.api";
import { Input, Button } from "../components/ui";
import { showToast } from "../utils/toast";
import { loginSchema, LoginFormValues } from "../validation/schemas";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // Guards against the isAuthenticated useEffect double-firing after a fresh
  // login: we set this ref to true immediately before calling login() so the
  // effect below knows the navigation is already handled inside onSubmit.
  const justLoggedIn = useRef(false);

  // Redirect already-authenticated users (e.g. back-button to /login).
  // Does NOT run on fresh login because justLoggedIn.current is true by then.
  useEffect(() => {
    if (isAuthenticated && user && !justLoggedIn.current) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    // Explicit defaultValues prevent any implicit form reset
    defaultValues: { email: "", password: "" },
    // Do not unregister fields on unmount — keeps values stable
    shouldUnregister: false,
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Single unified error path. loginApi uses axios which throws on non-2xx,
    // so ALL failure modes land in the catch block. The res.code check handles
    // the edge case where the backend returns HTTP 200 with an error code in body.
    try {
      const res = await loginApi(data);

      if (!res || res.code !== 200) {
        showToast(res?.message || "Invalid credentials. Please try again.", "error");
        return; // Return early — form stays intact, no navigation
      }

      // Mark before login() to suppress the isAuthenticated useEffect redirect
      justLoggedIn.current = true;
      login(res.data.token, res.data.user);
      showToast("Welcome back!", "success");
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        "Invalid credentials. Please try again.";
      showToast(msg, "error");
      // react-hook-form never calls reset() here — field values are preserved
    }
  };

  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof LoginFormValues;
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex w-80 bg-indigo-600 flex-col justify-between p-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <FiCheckSquare size={16} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">TaskFlow</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white leading-snug mb-3">
            Manage your work,<br />simply.
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Organize tasks, track progress, and stay on top of your work with a
            clean and focused dashboard.
          </p>
        </div>
        <p className="text-indigo-300 text-xs">TaskFlow &copy; {new Date().getFullYear()}</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FiCheckSquare size={13} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">TaskFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button loading={isSubmitting} className="w-full mt-1" size="lg">
              Sign in
            </Button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;