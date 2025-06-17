import { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  FileFilled,
} from "@ant-design/icons";
import { Button, Layout, Menu, Typography, theme } from "antd";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import useAuthStore from "../../stores/authStore";
const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // messageApi.handleLogout("Logout successful");
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();
  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            height: "64px",
            margin: "16px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title level={4} style={{ color: "#fff", margin: 0 }}></Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: <NavLink to="/admin/dashboard">Dashboard</NavLink>,
            },
            {
              key: "2",
              icon: <FileFilled />,
              label: <NavLink to="/admin/form">Form</NavLink>,
            },
            {
              key: "3",
              icon: <FileFilled />,
              label: <NavLink to="/admin/table">FormTable</NavLink>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            position: "sticky",
            top: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div style={{ paddingRight: "24px" }}>
            <UserOutlined style={{ fontSize: "18px", marginRight: "8px" }} />
            <Button
              onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
              color="green"
              variant="filled"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: colorBgContainer,
            borderTop: "1px solid #e8e8e8",
          }}
        >
          Admin Dashboard ©{new Date().getFullYear()}IT BRIDGE.COM.NP
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
