/**
 * Email Confirmation Page
 * Shown after user clicks email confirmation link from Supabase
 */

import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/UI/Button";

export const EmailConfirmPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Email Confirmed!
        </h1>

        <p className="text-gray-600 mb-6">
          Your email address has been successfully verified. You can now sign in
          to your account.
        </p>

        <div className="space-y-4">
          <Button onClick={() => navigate("/login")} className="w-full">
            Go to Login
          </Button>

          <p className="text-sm text-gray-500">
            Redirecting to login page in 5 seconds...
          </p>

          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
