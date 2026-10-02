import RoleLoginForm from "../Shared/RoleLoginForm";
import { useMerchantLoginMutation } from "../../redux-store/Services/MerchantApi";
import { useStaffSession } from "../../hooks/useStaffSession";

const LoginMerchant = () => {
  const [login, { isLoading }] = useMerchantLoginMutation();
  const startSession = useStaffSession("Merchant", "/merchant/dashboard");

  return (
    <RoleLoginForm
      brandRole='Merchant'
      title='Merchant Login'
      subtitle='Sign in to manage your store'
      isLoading={isLoading}
      links={[
        { to: "/merchant/signup", label: "New merchant? Create an account" },
        { to: "/driver/login", label: "Sign in as Driver" },
        { to: "/", label: "Go to HomePage" },
      ]}
      onLogin={async (credentials) => {
        startSession(await login(credentials).unwrap());
      }}
    />
  );
};

export default LoginMerchant;
