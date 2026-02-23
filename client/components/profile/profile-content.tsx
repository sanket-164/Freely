"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/feed/post-card";
import { ArrowLeft } from "lucide-react";

interface ProfileContentProps {
  username: string;
}

export function ProfileContent({ username }: ProfileContentProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/profile/${username}`,
      );
      if (!response.ok) throw new Error("Profile not found");

      const profileData = await response.json();
      setProfile(profileData);
      setEditData(profileData);

      // Load user's posts
      const postsResponse = await fetch(
        `http://localhost:5000/post/username/${username}`,
      );
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(Array.isArray(postsData) ? postsData : []);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || profile.name !== currentUser.name) {
      alert("You can only edit your own profile");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editData.name,
          display_name: editData.display_name,
          about: editData.about,
          picture: editData.picture,
          pubKey: currentUser.pubKey,
          birthday: editData.birthday,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditData(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating profile");
    }
  };

  const isOwnProfile =
    currentUser && profile && currentUser.name === profile.name;

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  const initials =
    profile.display_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-xl font-bold text-foreground">
            {profile.display_name}
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <Card className="border-b border-border rounded-none border-0 bg-card p-4">
          <div className="space-y-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.picture} alt={profile.display_name} />
              <AvatarFallback className="bg-accent text-accent-foreground text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {profile.display_name}
              </h2>
              <p className="text-muted-foreground">@{profile.name}</p>
            </div>

            {profile.about && (
              <p className="text-foreground text-base">{profile.about}</p>
            )}

            {profile.birthday && (
              <p className="text-sm text-muted-foreground">
                Born {profile.birthday.month}/{profile.birthday.day}/
                {profile.birthday.year}
              </p>
            )}

            {isOwnProfile && (
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="border-border text-foreground hover:bg-secondary"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            )}
          </div>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && isOwnProfile && editData && (
          <form
            onSubmit={handleUpdateProfile}
            className="border-b border-border bg-secondary/30 p-4"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editData.display_name}
                  onChange={(e) =>
                    setEditData({ ...editData, display_name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  About
                </label>
                <textarea
                  value={editData.about}
                  onChange={(e) =>
                    setEditData({ ...editData, about: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Picture URL
                </label>
                <input
                  type="url"
                  value={editData.picture}
                  onChange={(e) =>
                    setEditData({ ...editData, picture: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Posts Section */}
        <div className="divide-y divide-border">
          <div className="p-4 bg-secondary/10 text-sm font-medium text-muted-foreground">
            Posts
          </div>
          {posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No posts yet
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                onPostDeleted={() =>
                  setPosts(posts.filter((p) => p._id !== post._id))
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
