"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import {Eye, EyeOff, User, Mail, Lock,XCircle, Users, Stethoscope,UserPlus,} from "lucide-react";
import { loginSuccess } from "@/redux/slices/authSlice";
import { UserSignupSchema } from "@/validation/userAuth.validation";
import { userAuthService } from "@/services/user/userAuth.service";
import { setSignupEmail } from "@/redux/slices/signupSlice";



type Role = "client" | "nutritionist";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
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
    role: "client",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const result = UserSignupSchema.safeParse(formData);
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
      const {email} = formData

      const data = await userAuthService.register(formData);

      if (data.success) {
        dispatch(setSignupEmail(email));
        
        
        router.push(`/verify-otp`);
      } else {
        toast.error("Signup failed", {
          icon: <XCircle color="white" size={20} />,
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleGoogleError = (error?: any) => {
    console.error("Google Login Failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential!);
      const selectedRole = formData.role;
      if (!selectedRole) {
        toast.error("Please select whether you're a client or a nutritionist before continuing.");
        return;
      }
      
      const payload = {
        fullName: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        role: selectedRole,
        credential: credentialResponse.credential,
      };
      
      const response = await userAuthService.googleSignup(payload);
      if (response.success) {
        const { user, accessToken } = response;
        localStorage.setItem("token", accessToken);
        sessionStorage.setItem("tempUser", JSON.stringify({ email: user.email, role: user.role }))
        dispatch(loginSuccess());
        if (user.isBlocked) {
          toast.error("Your account has been blocked. Please contact support.");
          return;
        }
        
        if (user.role === "nutritionist") {
          switch (user.nutritionistStatus) {
            case "pending":
              toast("Your application is pending. Please complete your details.");
              router.push("/nutritionist/details");
              break;
              
            case "rejected":
              toast.error("Your application was rejected. You can reapply in your profile.");
              router.push("/home");
              break;
            case "approved":
            default:
              router.push("/nutritionist/dashboard");
              break;
            }
          }
          else if (user.role === "client") {
            router.push("/home");
          }
          toast.success(`Welcome ${user.fullName || "User"}!`);
        } else {
          toast.error(response.message || "Signup failed");
        }
      } catch (error: any) {
        console.error("Google login error:", error);
        toast.error(error?.response?.data?.message || "Google login failed");
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12 sm:py-16 lg:py-20">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl">🍃</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Join NutriWise and start your wellness journey
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            I am a
          </label>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                name: "client",
                icon: Users,
                label: "Client",
                subtext: "Seeking nutrition guidance",
              },
              {
                name: "nutritionist",
                icon: Stethoscope,
                label: "Nutritionist",
                subtext: "Provide expert advice",
              },
            ].map((option) => {
              const isActive = formData.role === option.name;
              const Icon = option.icon;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() =>
                    handleInputChange({
                      target: { name: "role", value: option.name },
                    } as any)
                  }
                  className={`relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 ${
                    isActive
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-colors ${
                      isActive ? "bg-green-500" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 sm:w-7 sm:h-7 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-semibold text-sm sm:text-base ${
                      isActive ? "text-green-700" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    {option.subtext}
                  </span>
                  {isActive && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-5">
          {[
            {
              name: "fullName",
              type: "text",
              placeholder: "Enter your full name",
              icon: <User className="text-green-500" size={18} />,
            },
            {
              name: "email",
              type: "email",
              placeholder: "you@example.com",
              icon: <Mail className="text-green-500" size={18} />,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                {field.name.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {field.icon}
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                />
              </div>
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <XCircle size={12} />
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Password Fields */}
          {[
            {
              name: "password",
              value: formData.password,
              show: showPassword,
              setShow: setShowPassword,
              label: "Password",
            },
            {
              name: "confirmPassword",
              value: formData.confirmPassword,
              show: showConfirmPassword,
              setShow: setShowConfirmPassword,
              label: "Confirm Password",
            },
          ].map((item) => (
            <div key={item.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {item.label}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                <input
                  type={item.show ? "text" : "password"}
                  name={item.name}
                  value={item.value}
                  onChange={handleInputChange}
                  placeholder={
                    item.name === "password"
                      ? "Create a strong password"
                      : "Confirm your password"
                  }
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => item.setShow(!item.show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {item.show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors[item.name] && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
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
          className="w-full mt-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <UserPlus className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-3">
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  useOneTap
  theme="outline"
  size="large"
/>

        <p className="text-xs text-gray-500 mt-1">
          (You’re signing up as a <strong>{formData.role}</strong>)
        </p>
      </div>
        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 hover:text-green-700 font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
