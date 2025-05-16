import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useResetPasswordMutation } from "@/redux/service/authServiceApi";
import Logo from "../components/Logo";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const userId = query.get("uId");

  const [resetPassword, { isLoading, isError, isSuccess }] =
    useResetPasswordMutation();
  const [isVisible] = useState(false);

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {},
  });

  const handleSubmit = () => {
    const payload = {
      token,
      userId,
      newPassword: formik.values.newPassword,
      confirmPassword: formik.values.confirmPassword,
    };

    resetPassword(payload).then((res) => {
      if (res.data.success) {
        addToast({
          title: "Success",
          description: "Password has been successfully reset",
          color: "success",
        });
        navigate("/login");
      }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      addToast({
        title: "Success",
        description: "Password reset successfully",
        color: "success",
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      addToast({
        title: "Error",
        description: "An error occurred while resetting the password",
        color: "danger",
      });
    }
  }, [isError]);

  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url('/images/login-bg.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute right-0 top-0">
        <div className="flex w-full justify-end p-2">
          <LanguageSwitcher />
        </div>
      </div>
      <div className="container h-screen mx-auto flex justify-end items-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl gap-4 flex flex-col">
          <Logo />
          <h1 className="text-2xl font-bold">Reset your password</h1>

          <FormikProvider value={formik}>
            <Form
              className="flex flex-col gap-4 w-[330px]"
              autoComplete="false"
              onSubmit={formik.handleSubmit}
            >
              <Input
                label="New Password"
                name="newPassword"
                type={isVisible ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={isVisible ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              <Button
                isLoading={isLoading}
                color="primary"
                onPress={handleSubmit}
              >
                Reset Password
              </Button>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
}
