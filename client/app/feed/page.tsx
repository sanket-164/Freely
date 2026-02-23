import { FeedContent } from "@/components/feed/feed-content";

export const metadata = {
  title: "Feed - Freely",
  description: "Explore posts from users on Freely",
};

export default function FeedPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <FeedContent />
    </main>
  );
}
