import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { registerUser } from "@/http/auth.api";
import useDocumentTitle from "@/hooks/useMeta";


// Zod validation schema
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email!"),
    password: z.string().min(6, "Password must be at least 6 characters long!"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine((data) => {
    if (data.password !== data.confirmPassword) {
      return [{ path: ["confirmPassword"], message: "Passwords do not match" }];
    }
    return [];
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const { Title } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();

  useDocumentTitle("Register | Inkspire");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const { isLoading, mutate } = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: registerUser,
    onSuccess: () => {
      message.success("Registration successful!");
      navigate('/auth/login');
      reset();
    },
    onError: (error) => {
      message.error("Failed to register user");
      console.error(error);
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    console.log("Success:", values);
    mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Title level={2}>Create your account</Title>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to={"/auth/login"}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your account
            </Link>
          </p>
        </div>

        <Form
          name="register"
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          requiredMark={false}
        >
          {/* Name input */}
          <Form.Item
            label="Name"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} size="large" />}
            />
          </Form.Item>

          {/* Email input */}
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} size="large" />}
            />
          </Form.Item>

          {/* Password input */}
          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input.Password {...field} size="large" />}
            />
          </Form.Item>

          {/* Confirm Password input */}
          <Form.Item
            label="Confirm Password"
            validateStatus={errors.confirmPassword ? "error" : ""}
            help={(errors.confirmPassword?.message as string) || ""} // Display error message if any
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => <Input.Password {...field} size="large" />}
            />
          </Form.Item>

          {/* Register button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-blue-600 hover:bg-blue-700"
              loading={isLoading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
