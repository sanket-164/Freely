'use client';

import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';

interface PostCardProps {
  post: any;
  currentUser: any;
  onPostDeleted: (postId: string) => void;
}

export function PostCard({ post, currentUser, onPostDeleted }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState('');

  const handleLike = async () => {
    if (loadingAction) return;
    setLoadingAction(true);

    try {
      if (liked) {
        const response = await fetch('http://localhost:5000/post/unlike', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser.user_id || currentUser._id,
            post_id: post._id,
          }),
        });

        if (response.ok) {
          setLiked(false);
          setLikeCount(Math.max(0, likeCount - 1));
        }
      } else {
        const response = await fetch('http://localhost:5000/post/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser.user_id || currentUser._id,
            post_id: post._id,
          }),
        });

        if (response.ok) {
          setLiked(true);
          setLikeCount(likeCount + 1);
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch('http://localhost:5000/post/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser.user_id || currentUser._id,
            post_id: post._id,
          }),
        });

        if (response.ok) {
          onPostDeleted(post._id);
        }
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/post/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: post._id,
          user_id: currentUser.user_id || currentUser._id,
          content: replyContent,
          tags: [],
        }),
      });

      if (response.ok) {
        const newReply = await response.json();
        setReplies([...replies, newReply]);
        setReplyContent('');
      }
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };

  const isOwner = post.user_id === (currentUser.user_id || currentUser._id);

  const initials = post.user_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <article className="p-4 hover:bg-secondary/30 transition-colors border-b border-border">
      <div className="flex gap-3">
        <Link href={`/profile/${post.user_name}`}>
          <Avatar className="cursor-pointer">
            <AvatarImage src={post.user_picture} alt={post.user_name} />
            <AvatarFallback className="bg-accent text-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${post.user_name}`}
                className="font-bold text-foreground hover:underline"
              >
                {post.user_name}
              </Link>
              <span className="text-muted-foreground">@{post.user_name}</span>
            </div>

            {isOwner && (
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <p className="mt-2 text-foreground text-base leading-normal">{post.content}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag: any, idx: number) => (
                <span key={idx} className="text-primary text-sm">
                  #{Array.isArray(tag) ? tag[1] : tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex gap-8 text-muted-foreground text-sm">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 hover:text-accent transition-colors group"
            >
              <MessageCircle className="w-4 h-4 group-hover:bg-accent/10 group-hover:rounded-full p-2 w-8 h-8" />
              <span>{replies.length}</span>
            </button>

            <button
              onClick={handleLike}
              disabled={loadingAction}
              className={`flex items-center gap-2 transition-colors group ${
                liked ? 'text-destructive' : 'hover:text-destructive'
              }`}
            >
              <Heart
                className="w-4 h-4 group-hover:bg-destructive/10 group-hover:rounded-full p-2 w-8 h-8"
                fill={liked ? 'currentColor' : 'none'}
              />
              <span>{likeCount}</span>
            </button>
          </div>

          {showReplies && (
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <form onSubmit={handleReply} className="flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Reply to this post..."
                  className="flex-1 bg-secondary text-foreground placeholder:text-muted-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <Button
                  type="submit"
                  disabled={!replyContent.trim()}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Reply
                </Button>
              </form>

              <div className="space-y-2">
                {replies.map((reply) => (
                  <div key={reply._id} className="pl-2 border-l-2 border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {reply.user_name}
                      </span>
                      <span className="text-xs text-muted-foreground">@{reply.user_name}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
