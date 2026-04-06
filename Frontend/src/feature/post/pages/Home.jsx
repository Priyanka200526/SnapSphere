import Navbar from "../../../Componenet/Navbar";
import LeftSidebar from "../components/Leftsidebar";
import RightSidebar from "../components/Rightsidebar";
import FeedPage from "../components/FeedPage";
import "../style/Home.scss";

const Home = () => {
  return (
    <div className="home">

      <Navbar />

      <div className="home-layout">

        <LeftSidebar />

        <div className="feed">
          <FeedPage />
        </div>
        <RightSidebar />

      </div>

    </div>
  );
};

export default Home;