"use client";
import { useState } from "react";
import Head from "next/head";
import api from "../constants/api"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userslice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  type Errors = {
    role?: string;
    email?: string;
    password?: string;
  };
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      

      console.log("Submitting form data:", formData);
      const response = await api.post(`/auth/${formData.role}/login`, formData);

      if (response.status === 200) {
        // Handle successful login, e.g., redirect to dashboard
        console.log("Login successful:", response.data);

        const user = response.data.user;
        
        dispatch(
          setUser({
            username: user.username, // or user.name, depending on your backend
            email: user.email,
            role: user.role,
          })
        );
        if (formData.role === "student") {
          // Add student-specific logic here if needed
          router.push("/student"); // Redirect to student dashboard
        } else if (formData.role === "teacher") {
          // Add teacher-specific logic here if needed
          router.push("/teacher"); // Redirect to teacher dashboard
        }
      } else {
        // Handle errors from the server
        console.error("Login failed:", response.data);
      }
      console.log("Login attempt:", formData);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Secure Access to Your Account</title>
        <meta
          name="description"
          content="Sign in to your account securely. Access your dashboard with role-based authentication for admin, user, manager, and employee roles."
        />
        <meta
          name="keywords"
          content="login, sign in, secure access, authentication, dashboard, admin, user portal"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="Login - Secure Access to Your Account"
        />
        <meta
          property="og:description"
          content="Sign in to your account securely with role-based authentication."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Login - Secure Access" />
        <meta
          name="twitter:description"
          content="Sign in to your account securely with role-based authentication."
        />
        <link rel="canonical" href="https://yourwebsite.com/login" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Login Page",
            description: "Secure login page with role-based authentication",
            url: "https://yourwebsite.com/login",
            mainEntity: {
              "@type": "WebApplication",
              name: "User Authentication System",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
            },
          })}
        </script>
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md">
          <article className="bg-white rounded-2xl shadow-xl p-8">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">Please sign in to your account</p>
            </header>
            <section
              className="space-y-6"
              role="form"
              aria-labelledby="login-form"
            >
              <h2 id="login-form" className="sr-only">
                Login Form
              </h2>
              <div className="form-group">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Role{" "}
                  <span className="text-red-500" aria-label="required">
                    *
                  </span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.role ? "true" : "false"}
                  aria-describedby={errors.role ? "role-error" : undefined}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 bg-white ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" className="text-gray-500">
                    Select your role
                  </option>
                  <option value="student" className="text-gray-900">
                    student
                  </option>
                  <option value="teacher" className="text-gray-900">
                    teacher
                  </option>
                </select>
                {errors.role && (
                  <p
                    id="role-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.role}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address{" "}
                  <span className="text-red-500" aria-label="required">
                    *
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : "email-help"}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 bg-white placeholder-gray-400 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <p id="email-help" className="sr-only">
                  Enter your registered email address
                </p>
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password{" "}
                  <span className="text-red-500" aria-label="required">
                    *
                  </span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : "password-help"
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  minLength={6}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 bg-white placeholder-gray-400 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <p id="password-help" className="sr-only">
                  Enter your account password, minimum 6 characters
                </p>
                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                aria-describedby="submit-help"
                className={`w-full text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
              <p id="submit-help" className="sr-only">
                Click to sign in to your account
              </p>
            </section>
            <footer className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:underline"
                  aria-label="Create a new account"
                >
                  Sign up
                </a>
              </p>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
}
