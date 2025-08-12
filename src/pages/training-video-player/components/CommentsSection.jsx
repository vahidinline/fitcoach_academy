import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const CommentsSection = ({ 
  comments = [],
  onAddComment,
  onLikeComment,
  className = ""
}) => {
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment?.(newComment.trim());
      setNewComment('');
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInHours = Math.floor((now - commentDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-card-foreground">
            Comments ({comments.length})
          </h3>
          <Icon name="MessageCircle" size={20} className="text-muted-foreground" />
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={16} className="text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-border">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="p-6">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                {comment.userAvatar ? (
                  <Image
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-secondary-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-card-foreground text-sm">
                    {comment.userName}
                  </span>
                  {comment.isCoach && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      Coach
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {comment.content}
                </p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onLikeComment?.(comment.id)}
                    className={`flex items-center space-x-1 text-xs animate-spring ${
                      comment.isLiked 
                        ? 'text-primary' :'text-muted-foreground hover:text-card-foreground'
                    }`}
                  >
                    <Icon 
                      name="ThumbsUp" 
                      size={14} 
                      className={comment.isLiked ? 'fill-current' : ''} 
                    />
                    <span>{comment.likes}</span>
                  </button>
                  
                  <button className="text-xs text-muted-foreground hover:text-card-foreground animate-spring">
                    Reply
                  </button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          {reply.userAvatar ? (
                            <Image
                              src={reply.userAvatar}
                              alt={reply.userName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                              <Icon name="User" size={12} className="text-secondary-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-card-foreground text-xs">
                              {reply.userName}
                            </span>
                            {reply.isCoach && (
                              <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                Coach
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Comments */}
      {comments.length > 3 && (
        <div className="p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setShowAllComments(!showAllComments)}
            className="w-full"
          >
            {showAllComments 
              ? 'Show Less Comments' 
              : `Show ${comments.length - 3} More Comments`
            }
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;