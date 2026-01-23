"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Sign up user
      const { data: userData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signupError) throw signupError;

      const userId = userData.user?.id;
      if (!userId) throw new Error("User ID not returned");

      // Insert profile row
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: userId,
          full_name: fullName,
          email,
          email_visible: true,
          phone_visible: false,
        },
      ]);
      if (profileError) throw profileError;

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-900 mb-2">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Join the Masters Alumni community
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Gideon Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="ring-1 ring-gray-200 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="ring-1 ring-gray-200 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="ring-1 ring-gray-200 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repeatPassword">Repeat Password</Label>
              <Input
                id="repeatPassword"
                type="password"
                placeholder="********"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
                className="ring-1 ring-gray-200 focus:ring-indigo-500 transition"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <a href="/auth/login" className="font-semibold text-indigo-600 hover:underline">
                Login
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
