// LoginPage.jsx - Page for user login
// This page provides a form for users to log in with their email/username and password. It uses Formik for form state management and Yup for validation. On successful login, it updates the auth context and redirects the user to the home page. It also handles and displays server-side error messages, such as invalid credentials.
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Basic validation for the login form.
const loginSchema = Yup.object({
  emailOrUsername: Yup.string().required(
    "Please enter your email address or username."
  ),
  password: Yup.string().required("Please enter your password."),
});

// Clear any previous user's Home page search state so a newly logged-in user
// does not inherit the last session's saved results.
const clearSearchSessionState = () => {
  sessionStorage.removeItem("searchTerm");
  sessionStorage.removeItem("searchMedia");
  sessionStorage.removeItem("searchResults");
  sessionStorage.removeItem("hasSearched");
  sessionStorage.removeItem("searchOffset");
  sessionStorage.removeItem("hasMore");
};

function LoginPage() {
  // Used to redirect after successful login.
  const navigate = useNavigate();

  // Auth context stores the token and logged-in user.
  const { login } = useAuth();

  // Store any server-side message, such as invalid credentials.
  const [serverMessage, setServerMessage] = useState("");

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card p-4 p-md-5 auth-card">
            {/* Page header */}
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold mb-2">Welcome back</h1>
              <p className="text-white-50 mb-0">
                Log in to search iTunes content and manage your favourites.
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
              initialValues={{ emailOrUsername: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setServerMessage("");

                try {
                  const response = await api.post("/auth/login", values);

                  // Clear any previous search state before applying the new login.
                  clearSearchSessionState();

                  // Save login state in auth context, then send the user home.
                  login(response.data.token, response.data.user);
                  navigate("/");
                } catch (error) {
                  setServerMessage(
                    error.response?.data?.message || "Login failed."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form noValidate>
                  {/* Email or username */}
                  <div className="mb-3">
                    <label htmlFor="emailOrUsername" className="form-label">
                      Email or username
                    </label>

                    <Field
                      id="emailOrUsername"
                      name="emailOrUsername"
                      className={`form-control auth-input ${
                        touched.emailOrUsername && errors.emailOrUsername
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter your email address or username"
                    />

                    <div className="form-text text-white-50">
                      Use the email address or username you registered with.
                    </div>

                    <div className="invalid-feedback d-block">
                      <ErrorMessage name="emailOrUsername" />
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
                      placeholder="Enter your password"
                    />

                    <div className="invalid-feedback d-block">
                      <ErrorMessage name="password" />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="btn btn-success w-100 rounded-pill py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Log in"}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Footer link */}
            <p className="mt-4 mb-0 text-center text-white-50">
              Need an account?{" "}
              <Link to="/register" className="auth-link">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;