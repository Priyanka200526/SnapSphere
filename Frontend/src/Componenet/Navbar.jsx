import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import {
  FiSearch,
  FiPlusSquare,
  FiBell,
  FiUser,
} from "react-icons/fi";
import "../feature/shared/style/navbar.scss";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate()

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src="/logo.png" alt="Pixora logo" className="logo-img" />
        <span>Pixora</span>
      </div>

      {/* Search */}
      <div className="search-box">
        <FiSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search users or posts..."
        />
      </div>

      {/* Actions */}
      <div className="nav-actions">

        <button
          type="button"
          className="icon-btn"
          aria-label="Create post"
          onClick={() => navigate("/create-post")}
        >
          <FiPlusSquare />
        </button>

        <button
          type="button"
          className="icon-btn"
          aria-label="Notifications"
        >
          <FiBell />
        </button>

        <button
          type="button"
          className="profile-btn"
          aria-label="Account"
          onClick={() => navigate("/profile")}
        >
          <FiUser />
        </button>

        <button
          type="button"
          className="icon-btn search-trigger"
          aria-label="Open search"
          onClick={() => setIsSearchOpen(true)}
        >
          <FiSearch />
        </button>

      </div>

    </nav>
  );
};

export default Navbar;