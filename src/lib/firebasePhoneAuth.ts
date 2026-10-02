import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";

import { auth } from "../config/firebase";

let recaptchaVerifier: RecaptchaVerifier | null = null;

/** Creates (once) the invisible reCAPTCHA Firebase's phone flow requires. */
function getRecaptcha(containerId: string): RecaptchaVerifier {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }
  return recaptchaVerifier;
}

/** Sends the OTP. `phoneNumber` must be E.164, e.g. "+919876543210". */
export function sendOtp(
  phoneNumber: string,
  containerId: string,
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phoneNumber, getRecaptcha(containerId));
}

/** Confirms the code and returns the Firebase ID token for the backend. */
export async function confirmOtp(
  confirmation: ConfirmationResult,
  code: string,
): Promise<string> {
  const credential = await confirmation.confirm(code);
  return credential.user.getIdToken();
}
