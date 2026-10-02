import { type FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ConfirmationResult } from "firebase/auth";

import { Footer } from "../../../Home/components/Footer";
import { Header } from "../../../Home/components/Header";
import { SupportBot } from "../../../Home/components/SupportBot";
import { confirmOtp, sendOtp } from "../../../lib/firebasePhoneAuth";
import { useFirebaseLoginMutation } from "../../../redux-store/Services/CustomerApi";
import { setCredentials } from "../../../redux-store/Slices/authSlice";

const RECAPTCHA_CONTAINER_ID = "lm-recaptcha-container";

/** Phone-OTP sign-in via Firebase. Sends a code, confirms it, then exchanges
 *  the resulting ID token for a Local Mart session at the backend. */
export default function SignInPage() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const [firebaseLogin, { isLoading: loggingIn }] = useFirebaseLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect") || "/";

  const onSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // A bare 10-digit number is almost always a Local Mart shopper typing
    // their number the way they normally would, without +91 — fill that in
    // rather than rejecting it.
    const stripped = phone.trim().replace(/[\s-]/g, "");
    const normalized = /^[6-9]\d{9}$/.test(stripped)
      ? `+91${stripped}`
      : stripped;

    if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
      setError("Enter your number in international format, e.g. +919876543210");
      return;
    }

    setSending(true);
    try {
      const result = await sendOtp(normalized, RECAPTCHA_CONTAINER_ID);
      setConfirmation(result);
      setStep("code");
    } catch {
      setError("Could not send the code. Check the number and try again.");
    } finally {
      setSending(false);
    }
  };

  const onConfirmOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!confirmation) return;

    setSending(true);
    try {
      const idToken = await confirmOtp(confirmation, code.trim());
      const result = await firebaseLogin({ idToken }).unwrap();
      dispatch(
        setCredentials({
          token: result.token,
          customer: {
            id: result.id,
            name: result.name,
            phoneNumber: result.phoneNumber,
            area: result.area,
          },
        }),
      );
      navigate(redirectTo, { replace: true });
    } catch {
      setError("That code didn't work. Check it and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='lm-home'>
      <Header />
      <main className='lm-main'>
        <div className='lm-auth'>
          <div className='lm-auth__card'>
            <h1 className='lm-auth__title'>Sign in</h1>
            <p className='lm-auth__sub'>
              {step === "phone"
                ? "We'll text you a one-time code."
                : `Enter the code sent to ${phone}`}
            </p>

            {step === "phone" ? (
              <form onSubmit={onSendOtp}>
                <label className='lm-auth__field'>
                  <span className='lm-auth__label'>Phone number</span>
                  <input
                    className='lm-auth__input'
                    type='tel'
                    placeholder='+91 98765 43210'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete='tel'
                  />
                </label>
                {error && <p className='lm-auth__error'>{error}</p>}
                <button
                  className='lm-btn lm-btn--primary lm-auth__submit'
                  type='submit'
                  disabled={sending || phone.trim() === ""}
                >
                  {sending ? "Sending…" : "Send code"}
                </button>
              </form>
            ) : (
              <form onSubmit={onConfirmOtp}>
                <label className='lm-auth__field'>
                  <span className='lm-auth__label'>One-time code</span>
                  <input
                    className='lm-auth__input'
                    type='text'
                    inputMode='numeric'
                    placeholder='123456'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete='one-time-code'
                  />
                </label>
                {error && <p className='lm-auth__error'>{error}</p>}
                <button
                  className='lm-btn lm-btn--primary lm-auth__submit'
                  type='submit'
                  disabled={sending || loggingIn || code.trim() === ""}
                >
                  {sending || loggingIn ? "Checking…" : "Confirm"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Firebase renders its invisible reCAPTCHA challenge into this node. */}
        <div id={RECAPTCHA_CONTAINER_ID} />
      </main>
      <Footer />

      {/* Help is only offered here when the shopper is on their way to pay. */}
      {redirectTo.split(/[?#]/)[0] === "/checkout" && <SupportBot />}
    </div>
  );
}
