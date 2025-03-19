import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import FeedView from "../components/FeedView";

const FeedsPage: React.FC = () => {
  return (
    <div className="container">
      <Head>
        <title>Your Feed - Unified Feed</title>
        <meta
          name="description"
          content="Your personalized content feed from all your connected platforms."
        />
      </Head>

      <Header />

      <main className="feed-page">
        <FeedView />
      </main>

      <footer className="main-footer">
        <p>
          &copy; {new Date().getFullYear()} Unified Feed. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default FeedsPage;
