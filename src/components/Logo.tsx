// import { useNavigate } from "react-router";

import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();
  return (
    <div>Flow Master</div>
    // <img
    //   src={"/images/chatbu-logo.webp"}
    //   alt="logo"
    //   width={128}
    //   onClick={() => navigate("/")}
    //   className="cursor-pointer mx-auto"
    // />
  );
}
