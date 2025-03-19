/* eslint-disable @next/next/no-img-element */
import React from "react";
import { type FeedItemData } from "./FeedView";
import { formatDistanceToNow } from "date-fns";

interface FeedItemProps {
  item: FeedItemData;
}

const FeedItem: React.FC<FeedItemProps> = ({ item }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      try {
        const formated = formatDistanceToNow(date, { addSuffix: true });
        return formated;
      } catch {
        return "Unknown date";
      }
    } catch {
      return "Unknown date";
    }
  };

  const renderYouTubeVideo = () => (
    <div className="feed-item youtube-item">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="thumbnail-container"
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="video-thumbnail"
          width={320}
          height={180}
        />
        {item.duration && (
          <span className="video-duration">
            {formatDuration(item.duration)}
          </span>
        )}
      </a>
      <div className="video-info">
        <h3 className="video-title">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h3>
        <div className="channel-info">
          <span className="channel-name">{item.channelTitle}</span>
        </div>
        <div className="video-stats">
          {item.viewCount && (
            <span className="view-count">
              {formatViewCount(item.viewCount)} views
            </span>
          )}
          <span className="publish-date">{formatDate(item.publishedAt)}</span>
        </div>
      </div>
    </div>
  );

  const formatViewCount = (viewCount: string) => {
    const count = parseInt(viewCount, 10);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  const formatDuration = (duration: string) => {
    // Format ISO 8601 duration to hh:mm:ss
    const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(duration);
    if (!match) return "";

    const hours = match[1] ? match[1].padStart(2, "0") + ":" : "";
    const minutes = (match[2] ?? "0").padStart(2, "0");
    const seconds = (match[3] ?? "0").padStart(2, "0");

    return `${hours}${minutes}:${seconds}`;
  };

  // Based on item.platform and item.type, render different feed items
  switch (item.platform) {
    case "youtube":
      return renderYouTubeVideo();
    default:
      return (
        <div className="feed-item generic-item">
          <h3>{item.title}</h3>
          <p>From {item.platform}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            View content
          </a>
        </div>
      );
  }
};

export default FeedItem;
