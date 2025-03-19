import React from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";

const HomePageMain: React.FC = () => {
  return (
    <div className="container">
      <Head>
        <title>Unified Feed - All Your Content in One Place</title>
        <meta
          name="description"
          content="Access all your YouTube content in one unified feed."
        />
      </Head>

      <Header />

      <main className="homepage">
        <section className="hero">
          <div className="hero-content">
            <h1>All Your Content in One Place</h1>
            <p>
              Connect your YouTube account to access your subscriptions and
              recommended videos in a clean, distraction-free interface.
            </p>
            <div className="cta-buttons">
              <Link href="/connect" className="primary-button">
                Get Started
              </Link>
              <Link href="/about" className="secondary-button">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            {/* Placeholder for a hero image */}
            <div className="image-placeholder">Feed Preview</div>
          </div>
        </section>

        <section className="features">
          <h2>Why Use Unified Feed?</h2>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>One Feed for Everything</h3>
              <p>
                See all your YouTube content in one unified feed without
                distractions or algorithm manipulation.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>
                We dont track your viewing habits or sell your data. Your feed
                is for your eyes only.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Efficient</h3>
              <p>
                Quick access to the content you care about without the bloat of
                traditional platforms.
              </p>
            </div>
          </div>
        </section>

        <section className="platforms">
          <h2>Supported Platforms</h2>
          <div className="platform-list">
            <div className="platform-item youtube">
              <h3>YouTube</h3>
              <p>Access your subscriptions and recommendations.</p>
              <span className="status available">Available Now</span>
            </div>
            <div className="platform-item twitter">
              <h3>Twitter</h3>
              <p>Follow your timeline and interactions.</p>
              <span className="status coming-soon">Coming Soon</span>
            </div>
            <div className="platform-item reddit">
              <h3>Reddit</h3>
              <p>Browse your subscribed subreddits.</p>
              <span className="status coming-soon">Coming Soon</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <p>
          &copy; {new Date().getFullYear()} Unified Feed. All rights reserved.
        </p>
        <div className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePageMain;
