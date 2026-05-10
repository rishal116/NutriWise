"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
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
import { UserSignupSchema } from "@/validation/userAuth.validation";
import { userAuthService } from "@/services/user/userAuth.service";
import { setSignupEmail } from "@/redux/slices/signupSlice";
import Link from "next/link";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const result = UserSignupSchema.safeParse({ ...formData });
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
      const data = await userAuthService.register({
        ...formData,
      });
      if (data.success) {
        dispatch(setSignupEmail(email));
        localStorage.setItem("signupEmail", email);
        router.push("/verify-otp");
      } else {
        toast.error("Signup failed. Please try again.", {
          icon: <XCircle color="white" size={20} />,
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : ((error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Something went wrong");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Google authentication failed. No credentials received.");
        return;
      }

      const decoded = jwtDecode<{
        name: string;
        email: string;
        sub: string;
      }>(credentialResponse.credential);

      const payload = {
        fullName: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        credential: credentialResponse.credential,
      };

      const response = await userAuthService.googleSignup(payload);

      if (response.success) {
        const { user, accessToken } = response;

        if (user.isBlocked) {
          toast.error("Your account has been blocked. Please contact support.");
          return;
        }

        dispatch(loginSuccess(accessToken));
        sessionStorage.setItem(
          "tempUser",
          JSON.stringify({ email: user.email }),
        );
        toast.success(`Welcome ${user.fullName || "User"}!`);
        router.push("/home");
      } else {
        toast.error(
          response.message || "Google signup failed. Please try again.",
        );
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Google login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 px-4 py-8 sm:py-12 lg:py-16">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl sm:text-4xl">🍃</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Join NutriWise and start your wellness journey
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 sm:space-y-5">
          {(
            [
              {
                name: "fullName",
                type: "text",
                placeholder: "Enter your full name",
                label: "Full Name",
                icon: <User className="text-emerald-600" size={18} />,
              },
              {
                name: "email",
                type: "email",
                placeholder: "you@example.com",
                label: "Email",
                icon: <Mail className="text-emerald-600" size={18} />,
              },
            ] as const
          ).map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                  {field.icon}
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className={`w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-gray-50 border ${
                    errors[field.name]
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  } focus:bg-white focus:ring-2 outline-none transition-all text-sm sm:text-base`}
                />
              </div>
              {errors[field.name] && (
                <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <XCircle size={12} />
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Password Fields */}
          {[
            {
              name: "password" as const,
              value: formData.password,
              show: showPassword,
              setShow: setShowPassword,
              label: "Password",
              placeholder: "Create a strong password",
            },
            {
              name: "confirmPassword" as const,
              value: formData.confirmPassword,
              show: showConfirmPassword,
              setShow: setShowConfirmPassword,
              label: "Confirm Password",
              placeholder: "Re-enter your password",
            },
          ].map((item) => (
            <div key={item.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {item.label}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                  size={18}
                />
                <input
                  type={item.show ? "text" : "password"}
                  name={item.name}
                  value={item.value}
                  onChange={handleInputChange}
                  placeholder={item.placeholder}
                  className={`w-full pl-10 sm:pl-11 pr-12 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-gray-50 border ${
                    errors[item.name]
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  } focus:bg-white focus:ring-2 outline-none transition-all text-sm sm:text-base`}
                />
                <button
                  type="button"
                  onClick={() => item.setShow(!item.show)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {item.show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors[item.name] && (
                <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <XCircle size={12} />
                  {errors[item.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <UserPlus className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-5 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-3 sm:px-4 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="w-full max-w-sm">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-5 sm:mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
