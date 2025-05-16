import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import LostPassword from "./pages/LostPassword";
import Appearance from "./pages/appearance/[slug]/page";
import ResetPassword from "./pages/ResetPassword";
import Public from "./components/Public";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import { menu, UserTypes } from "./lib/UserRolesAuth";
import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chatbots from "./pages/Chatbots";
import Vault from "./pages/Vault";
import Reports from "./pages/Reports";
import Integrations from "./pages/Integrations";
import Help from "./pages/Help";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ActivateRegistration from "./pages/ActivateRegistration";
import GoogleRedirect from "./pages/GoogleRedirect";
import Embed from "./pages/Embed";
import ChatHistoryDetails from "./pages/ChatHistoryDetails";
import TeamSettings from "./pages/TeamSettings";
import Subscriptions from "./pages/Subscriptions";
import Invoices from "./pages/Invoices";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "./redux/features/authSlice";
import { setConnected } from "./redux/features/websocketSlice";
import { initSocket, disconnectSocket } from "./redux/service/socketInstance";
import { Socket } from "socket.io-client";

function App() {
  const [activeRole, setActiveRole] = useState<UserTypes>(UserTypes.USER);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    setActiveRole(UserTypes.USER);
  }, []);

  useEffect(() => {
    let socket: Socket | null = null;
    if (currentUser && currentUser.userId) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL as string;
      socket = initSocket(socketUrl, { query: { userId: currentUser.userId } });
      dispatch(setConnected(true));
      socket.on("disconnect", () => dispatch(setConnected(false)));
    }
    return () => {
      disconnectSocket();
      dispatch(setConnected(false));
    };
  }, [currentUser, dispatch]);

  const getComponent = (item: any) => {
    switch (item) {
      case "home":
        return <Home />;
      case "profile":
        return <Profile />;
      case "chatbots":
        return <Chatbots />;
      case "vault":
        return <Vault />;
      case "reports":
        return <Reports />;
      case "appearance":
        return <Appearance />;
      case "integrations":
        return <Integrations />;
      case "help":
        return <Help />;
      case "support":
        return <Support />;
      case "settings":
        return <Settings />;
      case "team-settings":
        return <TeamSettings />;
      case "subscription":
        return <Subscriptions />;
      case "invoices":
        return <Invoices />;
      case "chat-history-details":
        return <ChatHistoryDetails />;
      default:
        break;
    }
  };
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="lost-password" element={<LostPassword />} />

        {/* <Route
          path="activate-lost-password"
          element={<ActivateLostPassword />}
        /> */}
        <Route
          path="reset-password"
          element={
            <div>
              <ResetPassword />
            </div>
          }
        />
        <Route path="new-password" element={<div>New Password</div>} />
        <Route path="auth/google/redirect" element={<GoogleRedirect />} />
        <Route path="embed/:id" element={<Embed />} />
        <Route
          path="activate-registration"
          element={<ActivateRegistration />}
        />
        {/* <Route path="appearance/:id" element={<Appearance />} /> */}
        {/* Private Routes   */}
        <Route element={<RequireAuth />}>
          {menu.map((item, index) => {
            if (item.role.includes(activeRole)) {
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={getComponent(item.name)}
                />
              );
            } else {
              return null;
            }
          })}
          <Route path="appearance/:id" element={<Appearance />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
