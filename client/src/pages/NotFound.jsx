import React from "react";
import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../app/components/ui";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-blue-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
          <p className="text-slate-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="rounded-xl gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/app/feed")}
            className="rounded-xl gap-2"
          >
            <Home size={20} />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
