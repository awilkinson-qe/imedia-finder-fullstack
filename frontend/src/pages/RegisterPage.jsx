// RegisterPage.jsx - Page for user registration
// This page provides a form for users to create a new account with a username, email, and password. It uses Formik for form state management and Yup for validation. On successful registration, it automatically logs in the user, updates the auth context, and redirects to the home page. It also handles and displays server-side error messages, such as duplicate email or username.
import { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Password validation:
// - minimum 8 characters
// - at least one lowercase letter
// - at least one uppercase letter
// - at least one number
// - at least one special character
// - blocks a few very common weak passwords
const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters.")
    .required("Please enter a username."),
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .matches(/[a-z]/, "Must include at least one lowercase letter.")
    .matches(/[A-Z]/, "Must include at least one uppercase letter.")
    .matches(/[0-9]/, "Must include at least one number.")
    .matches(
      /[^A-Za-z0-9]/,
      "Must include at least one special character."
    )
    .test(
      "not-common",
      "Password is too common. Please choose a stronger password.",
      (value) => {
        if (!value) return false;

        const common = [
          "password",
          "password123",
          "123456",
          "12345678",
          "qwerty",
          "abc123",
        ];

        return !common.includes(value.toLowerCase());
      }
    )
    .required("Please enter a password."),
});

// Clear any previous user's search state so a newly registered user
// does not inherit the last session's Home page results.
const clearSearchSessionState = () => {
  sessionStorage.removeItem("searchTerm");
  sessionStorage.removeItem("searchMedia");
  sessionStorage.removeItem("searchResults");
  sessionStorage.removeItem("hasSearched");
  sessionStorage.removeItem("searchOffset");
  sessionStorage.removeItem("hasMore");
};

// Simple password strength helper for live feedback.
const getPasswordStrength = (password) => {
  if (!password) {
    return { label: "Enter a password", className: "strength-empty" };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const common = ["password", "password123", "123456", "12345678", "qwerty", "abc123"];
  if (common.includes(password.toLowerCase())) {
    return { label: "Too weak", className: "strength-weak" };
  }

  if (score <= 2) return { label: "Weak", className: "strength-weak" };
  if (score === 3 || score === 4) {
    return { label: "Medium", className: "strength-medium" };
  }

  return { label: "Strong", className: "strength-strong" };
};

function RegisterPage() {
  // Used to redirect after successful registration.
  const navigate = useNavigate();

  // Auth context stores the token and logged-in user.
  const { login } = useAuth();

  // Store server-side feedback such as duplicate email/username.
  const [serverMessage, setServerMessage] = useState("");

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card p-4 p-md-5 auth-card">
            {/* Page header */}
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold mb-2">Create your account</h1>
              <p className="text-white-50 mb-0">
                Register to search iTunes content and save favourites.
              </p>
            </div>

            {/* Server-side error message */}
            {serverMessage && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {serverMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setServerMessage("")}
                  aria-label="Close"
                />
              </div>
            )}

            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={registerSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setServerMessage("");

                try {
                  const response = await api.post("/auth/register", values);

                  // Clear any previous search state before logging in the new user.
                  clearSearchSessionState();

                  // Auto-login after successful registration.
                  login(response.data.token, response.data.user);
                  navigate("/");
                } catch (error) {
                  setServerMessage(
                    error.response?.data?.message || "Registration failed."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors, touched, values }) => {
                const passwordStrength = useMemo(
                  () => getPasswordStrength(values.password),
                  [values.password]
                );

                return (
                  <Form noValidate>
                    {/* Username */}
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>

                      <Field
                        id="username"
                        name="username"
                        className={`form-control auth-input ${
                          touched.username && errors.username ? "is-invalid" : ""
                        }`}
                        placeholder="Choose a username"
                      />

                      <div className="form-text text-white-50">
                        This can be different from your email.
                      </div>

                      <div className="invalid-feedback d-block">
                        <ErrorMessage name="username" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email address
                      </label>

                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className={`form-control auth-input ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your email address"
                      />

                      <div className="form-text text-white-50">
                        Used for login and account identification.
                      </div>

                      <div className="invalid-feedback d-block">
                        <ErrorMessage name="email" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>

                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className={`form-control auth-input ${
                          touched.password && errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Create a password"
                      />

                      <div className="form-text text-white-50">
                        At least 8 characters, including uppercase, lowercase,
                        a number and a special character.
                      </div>

                      {/* Live password strength feedback */}
                      <div className={`small mt-2 ${passwordStrength.className}`}>
                        Password strength: {passwordStrength.label}
                      </div>

                      <div className="invalid-feedback d-block">
                        <ErrorMessage name="password" />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="btn btn-success w-100 rounded-pill py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                  </Form>
                );
              }}
            </Formik>

            {/* Footer link */}
            <p className="mt-4 mb-0 text-center text-white-50">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;