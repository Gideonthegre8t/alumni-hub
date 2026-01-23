"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
        {success ? (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <MailCheck className="w-10 h-10 text-indigo-600" />
              </div>
              <CardTitle className="text-3xl font-extrabold text-gray-900">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Password reset instructions sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                If an account exists for <span className="font-medium">{email}</span>,  
                you’ll receive a password reset link shortly.
              </p>

              <div className="mt-6 text-center text-sm">
                <Link
                  href="/auth/login"
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-extrabold text-gray-900 mb-2">
                Reset Password
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email and we’ll send you a reset link
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ring-1 ring-gray-200 focus:ring-indigo-500 transition"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Send reset link"
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-2">
                  Remembered your password?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
