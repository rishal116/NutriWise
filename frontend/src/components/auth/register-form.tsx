"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setOtpPending } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/user.service";
import { UserSignupSchema } from "@/validation/userAuth.validation";
import { Eye, EyeOff, User, Mail, Phone, Lock, Sparkles } from "lucide-react";

export default function SignupForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
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
      const response = await userAuthService.register(formData);

      if (response?.success) {
        // ✅ Store email in Redux and mark OTP flow
        dispatch(setOtpPending(formData.email));

        // ✅ Navigate to OTP page
        router.push("/verify-otp");
      } else {
        alert(response?.message || "Signup failed");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-5">
      <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 transition-colors group-focus-within:text-green-600" size={20} />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 transition-colors group-focus-within:text-green-600" size={20} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
            {errors.email}
          </p>
        )}
      </div>

      <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 transition-colors group-focus-within:text-green-600" size={20} />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 000-0000"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
            {errors.phone}
          </p>
        )}
      </div>

      <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 transition-colors group-focus-within:text-green-600" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a strong password"
            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
            {errors.password}
          </p>
        )}
      </div>

      <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 transition-colors group-focus-within:text-green-600" size={20} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 mt-6"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Account</span>
            <Sparkles className="w-5 h-5" />
          </>
        )}
      </button>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Google</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all group"
        >
          <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-sm font-medium">Facebook</span>
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6 pt-4 border-t border-gray-100">
        Already have an account?{" "}
        <a href="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors">
          Log In
        </a>
      </p>
    </div>
  );
}