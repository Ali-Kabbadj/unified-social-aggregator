import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Loading your feed...</p>
    </div>
  );
};

export default LoadingSpinner;
