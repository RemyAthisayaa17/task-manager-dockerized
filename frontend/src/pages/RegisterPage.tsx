import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FiCheckSquare } from "react-icons/fi";

import { registerApi } from "../api/auth.api";
import { Input, Select, Button } from "../components/ui";
import { showToast } from "../utils/toast";
import { registerSchema, RegisterFormValues } from "../validation/schemas";

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await registerApi(data);
      if (res.code !== 201) {
        showToast(res.message || "Registration failed", "error");
        return;
      }
      showToast("Account created successfully", "success");
      navigate("/login");
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Registration failed";
      showToast(msg, "error");
    }
  };

  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof RegisterFormValues;
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left accent panel */}
      <div className="hidden lg:flex w-80 bg-indigo-600 flex-col justify-between p-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <FiCheckSquare size={16} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">TaskFlow</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white leading-snug mb-3">
            Start organizing<br />your work today.
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Create an account to get started with task tracking, team management, and more.
          </p>
        </div>
        <p className="text-indigo-300 text-xs">TaskFlow &copy; {new Date().getFullYear()}</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FiCheckSquare size={13} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">TaskFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
            <p className="text-sm text-slate-500 mt-1">Fill in your details to get started</p>
          </div>

          {/* All fields stacked vertically — no side-by-side layout */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Full Name"
              required
              placeholder="Enter your full name"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email"
              type="email"
              required
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Phone"
              type="tel"
              required
              placeholder="Enter your phone number"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Select
              label="Gender"
              required
              error={errors.gender?.message}
              {...register("gender")}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>

            <Input
              label="Address"
              required
              placeholder="Enter your address"
              error={errors.address?.message}
              {...register("address")}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="Enter Min 8 chars,1 uppercase, 1 num,1 special char"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button loading={isSubmitting} className="w-full mt-1" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;