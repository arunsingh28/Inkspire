import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


const MainLayout: React.FC = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
