import { Outlet } from "react-router";

// import { injectStyle } from "react-toastify/dist/inject-style";
// if (typeof window !== "undefined") {
//   injectStyle();
// }

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
