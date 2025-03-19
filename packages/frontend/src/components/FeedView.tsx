import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FeedItem from "./FeedItem";
import LoadingSpinner from "./LoadingSpinner";

interface FeedData {
  user: {
    id: string;
    platforms: string[];
  };
  feeds: {
    youtube?: {
      user: {
        username: string;
        thumbnail: string;
        subscriberCount: string;
      };
      items: FeedItemData[];
    };
  };
  items: FeedItemData[];
}

export interface FeedItemData {
  id: string;
  platform: string;
  type: string;
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  channelTitle?: string;
  channelId?: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
  duration?: string;
  timestamp: string;
}

const FeedView: React.FC = () => {
  const [feedData, setFeedData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    const fetchFeed = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/feeds?userId=${Array.isArray(userId) ? userId[0] : userId}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.status}`);
        }

        const data = (await response.json()) as FeedData;
        setFeedData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error("Error fetching feed:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchFeed();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="feed-error">
        <h2>Error loading feed</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/auth/youtube")}>
          Reconnect YouTube
        </button>
      </div>
    );
  }

  if (!feedData) {
    return (
      <div className="no-feed">
        <h2>No feed data available</h2>
        <p>Connect your accounts to see your personalized feed</p>
        <button onClick={() => router.push("/auth/youtube")}>
          Connect YouTube
        </button>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Your Feed</h1>
        {feedData.user && (
          <div className="connected-platforms">
            <h3>Connected Platforms:</h3>
            <div className="platform-icons">
              {feedData.user.platforms.map((platform) => (
                <div key={platform} className={`platform-icon ${platform}`}>
                  {platform}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="feed-items">
        {feedData.items.length > 0 ? (
          feedData.items.map((item) => (
            <FeedItem key={`${item.platform}-${item.id}`} item={item} />
          ))
        ) : (
          <div className="empty-feed">
            <p>
              No items in your feed. Try connecting more accounts or check back
              later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedView;
