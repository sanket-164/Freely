import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Freely - Share Your Thoughts",
  description:
    "A minimal social media platform for sharing thoughts and connecting with others.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SignUpForm />
    </main>
  );
}
