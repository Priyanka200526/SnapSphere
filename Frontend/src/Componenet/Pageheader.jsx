import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "../feature/shared/style/backbutton.scss";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button onClick={handleBack} className="back-btn">
      <FiArrowLeft size={22} />
    </button>
  );
};

export default BackButton;