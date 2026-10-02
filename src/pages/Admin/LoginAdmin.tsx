import RoleLoginForm from "../Shared/RoleLoginForm";
import { useAdminLoginMutation } from "../../redux-store/Services/AdminApi";
import { useStaffSession } from "../../hooks/useStaffSession";

const LoginAdmin = () => {
  const [login, { isLoading }] = useAdminLoginMutation();
  const startSession = useStaffSession("Admin", "/admin/dashboard");

  return (
    <RoleLoginForm
      brandRole='Admin'
      title='Admin Login'
      subtitle='Sign in to the admin console'
      isLoading={isLoading}
      links={[
        { to: "/merchant/login", label: "Sign in as Merchant" },
        { to: "/driver/login", label: "Sign in as Driver" },
        { to: "/", label: "Go to HomePage" },
      ]}
      onLogin={async (credentials) => {
        startSession(await login(credentials).unwrap());
      }}
    />
  );
};

export default LoginAdmin;
