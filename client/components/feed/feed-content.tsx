"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PostCreator } from "./post-creator";
import { PostCard } from "./post-card";
import Link from "next/link";

export function FeedContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadPosts(parsedUser);
  }, [router]);

  const loadPosts = async (userData: any) => {
    try {
      // Try to fetch posts by user ID first
      const response = await fetch(`http://localhost:5000/post/latest`);
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/feed"
            className="text-2xl font-bold text-foreground hover:opacity-80"
          >
            Freely
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/profile/${user.name}`}
              className="text-sm text-primary hover:underline font-medium"
            >
              Profile
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-sm border-border text-foreground hover:bg-secondary"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Post Creator */}
        <div className="border-b border-border">
          <PostCreator user={user} onPostCreated={handlePostCreated} />
        </div>

        {/* Posts Feed */}
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No posts yet. Be the first to share!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
