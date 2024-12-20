import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { loginUser } from "@/http/auth.api";

import { appRoutes } from "@/utils/paths";
import { AxiosError } from "axios";
import { AuthActions, useAuthDispatch } from "@/provider/auth.contex";
import useDocumentTitle from "@/hooks/useMeta";

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please input your email!")
    .email("Please enter a valid email!"),
  password: z.string().min(1, "Please input your password!"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const { Title } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const location = useLocation();

  useDocumentTitle("Login | Inkspire");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log(location.state)

  const { isLoading, mutate } = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: loginUser,
    onSuccess: (data) => {
      message.success("Login successful!");
      reset();
      dispatch({
        type: AuthActions.setUser,
        payload: data.data.data,
      });
      return navigate(
        location.state.destination || `/${appRoutes.dashboard.INDEX}`,
        {replace: true}
      );
    },
    onError: (error: AxiosError) => {
      return message.error((error.response?.data as { error: string }).error);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate({ ...data });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Title level={2}>Log in to your account</Title>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <Form
          name="login"
          onFinish={handleSubmit(onSubmit)}
          className="mt-8 space-y-8"
        >
          {/* Email input */}
          <Form.Item
            validateStatus={errors.email ? "error" : ""}
            help={errors.email ? errors.email.message : ""}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={
                    <Mail
                      size={20}
                      strokeWidth={1.2}
                      className="text-gray-700"
                    />
                  }
                  placeholder="Email"
                  size="large"
                />
              )}
            />
          </Form.Item>

          {/* Password input */}
          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={errors.password ? errors.password.message : ""}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Password"
                  size="large"
                />
              )}
            />
          </Form.Item>

          {/* Submit button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="large"
              loading={isLoading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
