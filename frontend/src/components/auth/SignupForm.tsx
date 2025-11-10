"use client";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserEmailAndRole } from "@/redux/slices/authSlice";
import { UserSignupSchema } from "@/validation/userAuth.validation";
import { Eye, EyeOff, User, Mail, Phone, Lock, Sparkles } from "lucide-react";
import { userAuthService } from "@/services/user/user.service";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionist.service";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";

interface SignupFormProps {
  role: "client" | "nutritionist";
}

export default function SignupForm({ role }: SignupFormProps) {
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
      const payload = { ...formData };
      const data =
        role === "nutritionist"
          ? await nutritionistAuthService.register(payload)
          : await userAuthService.register(payload);

      if (data.success) {
        dispatch(setUserEmailAndRole({ email: formData.email, role }));
        router.push(`/${role}/verify-otp`);
      } else {
        toast.error("Signup failed", {
          style: {
            borderRadius: "10px",
            background: "#f56565",
            color: "#fff",
            fontWeight: "bold",
          },
          icon: <XCircle color="white" size={20} />,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        duration: 2000,
        style: {
          borderRadius: "10px",
          background: "#f56565",
          color: "#fff",
          padding: "16px",
          fontWeight: "bold",
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        },
        icon: <XCircle color="white" size={20} />,
      });
    } finally {
      setLoading(false);
    }
  };

 const handleGoogleSuccess = async (credentialResponse: any) => {
  try {
    if (!credentialResponse?.credential)
      throw new Error("No credential returned");

    const decoded: any = jwtDecode(credentialResponse.credential);

    const payload = {
      fullName: decoded.name,
      email: decoded.email,
      googleId: decoded.sub,
      role,
      credential: credentialResponse.credential, 
    };

    const data =
      role === "nutritionist"
        ? await nutritionistAuthService.googleSignup(payload)
        : await userAuthService.googleSignup(payload);

        console.log(data)

    if (data?.success && data?.accessToken) {
      localStorage.setItem("token", data.accessToken);
      dispatch(setUserEmailAndRole({ email: data.user.email, role: data.user.role }));
    } else {
      toast.error(data?.message||"field");
    }
    switch (data.user.role) {
      case "client": router.push("/home"); break;
      case "nutritionist": router.push("/nutritionist/details"); break;
      default: router.push("/");
      }
  } catch (err: any) {
    console.log(err)
    toast.error(err||"error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {role === "nutritionist"
              ? "Join as a Nutritionist"
              : "Create Your Account"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign up to get started with NutriWise
          </p>
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
            {
              name: "phone",
              type: "tel",
              placeholder: "+91 98765 43210",
              icon: <Phone className="text-green-500" size={18} />,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
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
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-50 border focus:border-green-500 focus:bg-white outline-none transition"
                />
              </div>
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-gray-50 border focus:border-green-500 focus:bg-white outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => item.setShow(!item.show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {item.show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors[item.name] && (
                <p className="text-red-500 text-xs mt-1">
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
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-semibold transition-all flex justify-center items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign Up</span>
              <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Signup */}
<div className="flex flex-col items-center mt-4">
  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => toast.error("Google sign-in failed")}
    />
  </div>
</div>


        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href={`/${role}/login`}
            className="text-green-600 font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
