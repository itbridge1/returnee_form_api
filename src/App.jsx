import { Form, Route, Routes } from "react-router-dom";
import AdminLayout from "./admin/adminLayout/AdminLayout";
import Dashboard from "./admin/pages/dashboard/Dashboard";
import Login from "./auth/login/Login";
// import Register from "./auth/register/Register";
import ErrorPage from "./errorPage/ErrorPage";
import FormTable from "./admin/pages/Form/MainTable/FormTable";
import PersonalInfoForm from "./admin/pages/Form/FormPages/sadasheyAabedanForm/SadasheyAabedanForm";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLayout />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/form" element={<PersonalInfoForm />} />
          <Route path="/admin/table" element={<FormTable />} />
        </Route>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}
export default App;
