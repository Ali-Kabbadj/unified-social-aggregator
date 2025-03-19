import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import { useRouter } from "next/router";

interface ConnectedAccount {
  provider: string;
  providerId: string;
  expiresAt: string;
}

interface UserSettings {
  id: string;
  email?: string;
  displayName?: string;
  connectedAccounts: ConnectedAccount[];
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      const userId =
        sessionStorage.getItem("userId") ??
        (typeof router.query.userId === "string" ? router.query.userId : undefined);

      if (!userId) {
        setError("No user ID found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/user/${userId}/settings`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch settings: ${response.status}`);
        }

        const data = (await response.json()) as UserSettings;
        setSettings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchSettings();
  }, [router.query]);

  const disconnectAccount = async (provider: string) => {
    if (!settings?.id) return;

    try {
      const response = await fetch(
        `http://localhost:3001/user/${settings.id}/disconnect/${provider}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to disconnect account: ${response.status}`);
      }

      // Refresh settings
      const data = (await response.json()) as UserSettings;
      const updatedSettings: UserSettings = data;
      setSettings(updatedSettings);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to disconnect account",
      );
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header />
        <main className="settings-page">
          <div className="loading">Loading settings...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Header />
        <main className="settings-page">
          <div className="error-message">{error}</div>
          <button
            onClick={() => router.push("/connect")}
            className="primary-button"
          >
            Connect Accounts
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>Account Settings - Unified Feed</title>
        <meta
          name="description"
          content="Manage your Unified Feed account settings and connected platforms."
        />
      </Head>

      <Header />

      <main className="settings-page">
        <h1>Account Settings</h1>

        {settings && (
          <div className="settings-container">
            <section className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <label>Email:</label>
                  <span>{settings.email ?? "No email provided"}</span>
                </div>
                <div className="info-item">
                  <label>Display Name:</label>
                  <span>{settings.displayName ?? "No display name"}</span>
                </div>
              </div>
            </section>

            <section className="connected-accounts-section">
              <h2>Connected Accounts</h2>
              {settings.connectedAccounts.length > 0 ? (
                <div className="accounts-list">
                  {settings.connectedAccounts.map((account) => (
                    <div key={account.provider} className="account-item">
                      <div className={`platform-icon ${account.provider}`}>
                        {account.provider}
                      </div>
                      <div className="account-details">
                        <h3>
                          {account.provider.charAt(0).toUpperCase() +
                            account.provider.slice(1)}
                        </h3>
                        <p>
                          Connected until:{" "}
                          {new Date(account.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => disconnectAccount(account.provider)}
                        className="disconnect-button"
                      >
                        Disconnect
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-accounts">
                  <p>No accounts connected.</p>
                  <button
                    onClick={() => router.push("/connect")}
                    className="primary-button"
                  >
                    Connect Accounts
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="main-footer">
        <p>
          &copy; {new Date().getFullYear()} Unified Feed. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SettingsPage;
