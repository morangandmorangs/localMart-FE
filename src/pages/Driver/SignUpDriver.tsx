import RoleSignUpForm from "../Shared/RoleSignUpForm";
import { useDriverRegisterMutation } from "../../redux-store/Services/DriverApi";
import { useStaffSession } from "../../hooks/useStaffSession";

const SignUpDriver = () => {
  const [register, { isLoading }] = useDriverRegisterMutation();
  const startSession = useStaffSession("Driver", "/driver/dashboard");

  return (
    <RoleSignUpForm
      brandRole='Driver'
      title='Driver Sign Up'
      subtitle='Create your account, then upload documents for review'
      isLoading={isLoading}
      links={[
        { to: "/driver/login", label: "Already registered? Login" },
        { to: "/merchant/signup", label: "Sign up as Merchant" },
        { to: "/", label: "Go to HomePage" },
      ]}
      onSignUp={async (input) => {
        startSession(await register(input).unwrap());
      }}
    />
  );
};

export default SignUpDriver;
