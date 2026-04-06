import React from "react";
import "../style/rightsidebar.scss";

const Rightsidebar = () => {
  return (
    <aside className="right-sidebar">

      {/* Current User */}
      <div className="current-user">
        <img src="https://i.pravatar.cc/40?img=5" alt="Priyanka" />
        <div className="user-info">
          <p className="username">Priyanka</p>
          <span className="subtext">Web Developer</span>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="sidebar-card">

        <div className="suggested-header">
          <h3 className="sidebar-title">Suggested for you</h3>
          <button className="see-all">See All</button>
        </div>

        <div className="user">
          <img src="https://i.pravatar.cc/40?img=1" alt="Rahul" />
          <div className="user-info">
            <p className="username">Rahul</p>
            <span className="subtext">Suggested for you</span>
          </div>
          <button className="follow-btn">Follow</button>
        </div>

        <div className="user">
          <img src="https://i.pravatar.cc/40?img=2" alt="Ankit" />
          <div className="user-info">
            <p className="username">Ankit</p>
            <span className="subtext">Suggested for you</span>
          </div>
          <button className="follow-btn">Follow</button>
        </div>

        <div className="user">
          <img src="https://i.pravatar.cc/40?img=3" alt="Sara" />
          <div className="user-info">
            <p className="username">Sara</p>
            <span className="subtext">Suggested for you</span>
          </div>
          <button className="follow-btn">Follow</button>
        </div>

      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <p>About • Help • Press • API • Jobs • Privacy</p>
        <p className="copyright">© 2026 Pixora</p>
      </div>

    </aside>
  );
};

export default Rightsidebar;