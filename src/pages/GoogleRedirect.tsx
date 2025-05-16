import { setCreadentials } from "@/redux/features/authSlice";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleRedirect() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");

  useEffect(() => {
    if (!user) {
      return;
    }
    try {
      if (user === "null") {
        addToast({
          title: "No user data found",
          description: "To log in with Google, first sign up with Google.",
          color: "warning",
        });
        navigate("/register");
        return;
      }
      const parsed = JSON.parse(user);
      if (parsed.success) {
        dispatch(
          setCreadentials({
            user: {
              userId: parsed.userId,
              userEmail: parsed.userEmail,
              userName: parsed.userName,
            },
            token: {
              accessToken: parsed.accessToken,
              refreshToken: parsed.refreshToken,
            },
          })
        );
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  return <div>GoogleRedirect</div>;
}
