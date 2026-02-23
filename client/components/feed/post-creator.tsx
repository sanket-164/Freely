'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PostCreatorProps {
  user: any;
  onPostCreated: (post: any) => void;
}

export function PostCreator({ user, onPostCreated }: PostCreatorProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const tagsMatch = content.match(/#\w+/g) || [];
      const tags = tagsMatch.map((tag) => ['t', tag.slice(1)]);

      const response = await fetch('http://localhost:5000/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id || user._id,
          content,
          tags,
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const newPost = await response.json();
      onPostCreated(newPost);
      setContent('');
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const initials = user.display_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-background">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={user.picture} alt={user.display_name} />
          <AvatarFallback className="bg-accent text-accent-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="mb-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full text-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
