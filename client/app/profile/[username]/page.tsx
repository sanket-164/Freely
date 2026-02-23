import { ProfileContent } from "@/components/profile/profile-content";

export const metadata = {
  title: "User Profile - Freely",
  description: "View user profile on Freely",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  console.log(username);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <ProfileContent username={username} />
    </main>
  );
}
