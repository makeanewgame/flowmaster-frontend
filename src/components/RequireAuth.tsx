import { useLocation, Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/features/authSlice";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);

  const location = useLocation();

  return token ? (
    <div className="min-h-screen overflow-hidden flex w-screen">
      <SideBar />

      <div className="flex flex-col w-full">
        <TopBar />
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
