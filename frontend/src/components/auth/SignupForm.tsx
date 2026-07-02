"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  XCircle,
  UserPlus,
  Loader2,
} from "lucide-react";
import { loginSuccess } from "@/redux/slices/authSlice";
import { signupSchema } from "@/validations/auth.validation";
import { userAuthService } from "@/services/user/userAuth.service";
import { setSignupEmail } from "@/redux/slices/signupSlice";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { SignupRequest } from "@/types/auth/auth-request.types";
import Logo from "../common/Logo";

export default function SignupForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupRequest>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) router.replace("/");
  }, [token, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const { email } = formData;
      const data = await userAuthService.register(formData);
      if (data.success) {
        dispatch(setSignupEmail(email));
        localStorage.setItem("signupEmail", email);
        router.push("/verify-otp");
      } else {
        toast.error("Signup failed", {
          icon: <XCircle color="white" size={20} />,
        });
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error?: unknown) => {
    console.error("Google Login Failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      const credential = credentialResponse.credential;

      if (!credential) {
        toast.error("Google authentication failed");
        return;
      }

      const payload = { credential };

      const response = await userAuthService.googleAuth(payload);

      if (!response.success) {
        toast.error(response.message || "Signup failed");
        return;
      }
      dispatch(loginSuccess(response.accessToken));
      if (!response.isProfileCompleted) {
        router.push("/complete-profile");
        return;
      }

      switch (response.activeRole) {
        case "admin":
          router.push("/admin");
          break;
        case "nutritionist":
          router.push("/nutritionist");
          break;
        default:
          router.push("/");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/60 px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-100 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo size="large" linkable={false} />
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight mt-5">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Join NutriWise and start your wellness journey
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-3 py-2.5 sm:py-3 rounded-xl bg-gray-50 border ${
                    errors.fullName
                      ? "border-red-400"
                      : "border-gray-200 focus:border-emerald-500"
                  } focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <XCircle size={12} /> {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 sm:py-3 rounded-xl bg-gray-50 border ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-200 focus:border-emerald-500"
                  } focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <XCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {[
              {
                name: "password",
                value: formData.password,
                show: showPassword,
                setShow: setShowPassword,
                label: "Password",
                placeholder: "Create a strong password",
              },
              {
                name: "confirmPassword",
                value: formData.confirmPassword,
                show: showConfirmPassword,
                setShow: setShowConfirmPassword,
                label: "Confirm Password",
                placeholder: "Confirm your password",
              },
            ].map((item) => (
              <div key={item.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {item.label}
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={item.show ? "text" : "password"}
                    name={item.name}
                    value={item.value}
                    onChange={handleInputChange}
                    placeholder={item.placeholder}
                    className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-gray-50 border ${
                      errors[item.name]
                        ? "border-red-400"
                        : "border-gray-200 focus:border-emerald-500"
                    } focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => item.setShow(!item.show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {item.show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors[item.name] && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <XCircle size={12} /> {errors[item.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-7 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating
                account...
              </>
            ) : (
              <>
                Create Account <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}