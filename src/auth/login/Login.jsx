import { Form, Input, Button, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { LoginForm } from "../../apis/auth";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

function Login() {
  const { setToken, isLoggedIn } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const mutationLogin = useMutation({
    mutationFn: LoginForm,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      messageApi.success(data.message);
      setToken(data.data.access_token);
      setTimeout(() => {
        navigate("/");
      }, 1000);
      console.log("res", data);
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const onFinish = (values) => {
    console.log("Received values:", values);
    mutationLogin.mutate(values);
  };

  if (isLoggedIn) {
    setTimeout(() => {
      return <Navigate to="/" />;
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {contextHolder}
      <Spin spinning={loading}>
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex w-full max-w-4xl overflow-hidden bg-white rounded-2xl shadow-2xl">
              <div className="hidden md:block w-1/2 relative">
                <img
                  src="/images/image.png"
                  alt="login"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30" />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12">
                <div className="space-y-8">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                      Welcome Back
                    </h1>
                    <p className="text-gray-500">Please sign in to continue</p>
                  </div>

                  <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    className="space-y-6"
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please input your email!" },
                        {
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Email"
                        className="rounded-lg py-2"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Password"
                        className="rounded-lg py-2"
                      />
                    </Form.Item>

                    <div className="flex justify-between items-center mb-6">
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        className="h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold text-lg"
                      >
                        Sign In
                      </Button>
                    </Form.Item>
                  </Form>

                  {/* <p className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Sign up
                  </a>
                </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default Login;
