"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface User {
  id: string;
  email?: string;
  displayName?: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user ID is in URL or sessionStorage
    const userId = searchParams.get("userId");
    if (userId) {
      // Store userId in sessionStorage for persistence
      sessionStorage.setItem("userId", userId);
      void fetchUserInfo(userId);
    } else {
      // Try to get from sessionStorage
      const storedUserId = sessionStorage.getItem("userId");
      if (storedUserId) {
        void fetchUserInfo(storedUserId);
      }
    }
  }, [searchParams, router]);

  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const userData = (await response.json()) as User;
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    setUser(null);
    router.push("/");
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link href="/">
          <h1>Unified Feed</h1>
        </Link>
      </div>

      <nav className="main-nav">
        <Link href="/">Home</Link>
        {user ? (
          <>
            <Link href={`/feeds?userId=${user.id}`}>My Feed</Link>
            <Link href="/settings">Settings</Link>
          </>
        ) : (
          <Link href="/connect">Connect Accounts</Link>
        )}
      </nav>

      <div className="user-section">
        {user ? (
          <div className="user-info">
            <span>{user.displayName ?? user.email ?? "User"}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <Link href="/connect" className="login-button">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
