import RoleSignUpForm from "../Shared/RoleSignUpForm";
import { useMerchantRegisterMutation } from "../../redux-store/Services/MerchantApi";
import { useStaffSession } from "../../hooks/useStaffSession";

const SignUpMerchant = () => {
  const [register, { isLoading }] = useMerchantRegisterMutation();
  const startSession = useStaffSession("Merchant", "/merchant/dashboard");

  return (
    <RoleSignUpForm
      brandRole='Merchant'
      title='Merchant Sign Up'
      subtitle='Create your account, then upload documents for review'
      isLoading={isLoading}
      links={[
        { to: "/merchant/login", label: "Already registered? Login" },
        { to: "/driver/signup", label: "Sign up as Driver" },
        { to: "/", label: "Go to HomePage" },
      ]}
      onSignUp={async (input) => {
        startSession(await register(input).unwrap());
      }}
    />
  );
};

export default SignUpMerchant;
