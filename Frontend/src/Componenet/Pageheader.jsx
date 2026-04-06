// src/feature/shared/components/PageHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import "../feature/shared/style/pageheadler.scss";

const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="page-header">
      <button className="back-btn" onClick={handleBack}>
        <FiArrowLeft size={20} />
      </button>

      <h2 className="title">{title}</h2>

      <button className="home-btn" onClick={() => navigate("/")}>
        <FiHome size={20} />
      </button>
    </div>
  );
};

export default PageHeader;