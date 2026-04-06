import { NavLink } from "react-router-dom";
import { FiHome, FiCompass, FiMessageCircle, FiBookmark, FiSettings } from "react-icons/fi";
import "../style/Leftsidebar.scss";

const Leftsidebar = () => {
  return (
    <aside className="left-sidebar">

      <NavLink to="/" className="menu-item">
        <FiHome />
        <span>Home</span>
      </NavLink>

      <NavLink to="/explore" className="menu-item">
        <FiCompass />
        <span>Explore</span>
      </NavLink>

      <NavLink to="/messages" className="menu-item">
        <FiMessageCircle />
        <span>Messages</span>
      </NavLink>

      <NavLink to="/saved" className="menu-item">
        <FiBookmark />
        <span>Saved</span>
      </NavLink>

      <NavLink to="/settings" className="menu-item">
        <FiSettings />
        <span>Settings</span>
      </NavLink>

    </aside>
  );
};

export default Leftsidebar;