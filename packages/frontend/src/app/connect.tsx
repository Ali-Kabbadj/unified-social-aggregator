import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Link from "next/link";

const ConnectPage: React.FC = () => {
  return (
    <div className="container">
      <Head>
        <title>Connect Your Accounts - Unified Feed</title>
        <meta
          name="description"
          content="Connect your accounts to Unified Feed to see all your content in one place."
        />
      </Head>

      <Header />

      <main className="connect-page">
        <h1>Connect Your Accounts</h1>
        <p>
          Link your accounts to start seeing your content in one unified feed.
        </p>

        <div className="connect-options">
          <div className="connect-card">
            <div className="platform-icon youtube">YouTube</div>
            <h2>YouTube</h2>
            <p>
              Connect to see videos from your subscriptions and recommendations.
            </p>
            <Link
              href="http://localhost:3001/auth/youtube"
              className="connect-button youtube"
            >
              Connect YouTube
            </Link>
          </div>

          <div className="connect-card disabled">
            <div className="platform-icon twitter">Twitter</div>
            <h2>Twitter</h2>
            <p>Coming soon - connect to see tweets from accounts you follow.</p>
            <button disabled className="connect-button twitter disabled">
              Coming Soon
            </button>
          </div>

          <div className="connect-card disabled">
            <div className="platform-icon reddit">Reddit</div>
            <h2>Reddit</h2>
            <p>
              Coming soon - connect to see posts from subreddits you follow.
            </p>
            <button disabled className="connect-button reddit disabled">
              Coming Soon
            </button>
          </div>
        </div>
      </main>

      <footer className="main-footer">
        <p>
          &copy; {new Date().getFullYear()} Unified Feed. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ConnectPage;
