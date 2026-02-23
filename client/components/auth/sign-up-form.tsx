"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInForm } from "./sign-in-form";

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    about: "",
    picture: "",
    birthday: { year: new Date().getFullYear() - 25, month: 1, day: 1 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBirthdayChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      birthday: {
        ...prev.birthday,
        [field]: parseInt(value),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Sign up failed");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/feed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (showSignIn) {
    return <SignInForm onSignUp={() => setShowSignIn(false)} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-border">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Freely</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your thoughts with the world
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Username
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="sanket"
                required
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Display Name
              </label>
              <Input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                placeholder="Sanket Sadadiya"
                required
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                About
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                className="w-full px-3 py-2 border border-border rounded-md bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Picture URL
              </label>
              <Input
                type="url"
                name="picture"
                value={formData.picture}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Year
                </label>
                <Input
                  type="number"
                  value={formData.birthday.year}
                  onChange={(e) => handleBirthdayChange("year", e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="border-border bg-secondary text-foreground text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Month
                </label>
                <Input
                  type="number"
                  value={formData.birthday.month}
                  onChange={(e) =>
                    handleBirthdayChange("month", e.target.value)
                  }
                  min="1"
                  max="12"
                  className="border-border bg-secondary text-foreground text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Day
                </label>
                <Input
                  type="number"
                  value={formData.birthday.day}
                  onChange={(e) => handleBirthdayChange("day", e.target.value)}
                  min="1"
                  max="31"
                  className="border-border bg-secondary text-foreground text-center"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => setShowSignIn(true)}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
