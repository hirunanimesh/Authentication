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

              {/* Google Login Buttons */}
              <div className="space-y-3">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/student`}
                  className="block"
                >
                  <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google as a Student
                  </button>
                </a>

                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/teacher`}
                  className="block"
                >
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google as a Teacher
                  </button>
                </a>
              </div>
            </section>
            <footer className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
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
