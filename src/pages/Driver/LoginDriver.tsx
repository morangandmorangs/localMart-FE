import RoleLoginForm from "../Shared/RoleLoginForm";
import { useDriverLoginMutation } from "../../redux-store/Services/DriverApi";
import { useStaffSession } from "../../hooks/useStaffSession";

const LoginDriver = () => {
  const [login, { isLoading }] = useDriverLoginMutation();
  const startSession = useStaffSession("Driver", "/driver/dashboard");

  return (
    <RoleLoginForm
      brandRole='Driver'
      title='Driver Login'
      subtitle='Sign in to deliver orders'
      isLoading={isLoading}
      links={[
        { to: "/driver/signup", label: "New driver? Create an account" },
        { to: "/merchant/login", label: "Sign in as Merchant" },
        { to: "/", label: "Go to HomePage" },
      ]}
      onLogin={async (credentials) => {
        startSession(await login(credentials).unwrap());
      }}
    />
  );
};

export default LoginDriver;
