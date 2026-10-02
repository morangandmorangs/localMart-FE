import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../config/firebase";

/** Google sign-in for the Merchant/Driver login pages. Returns the ID token
 *  the backend's /auth/google route verifies server-side. */
export async function signInWithGoogle(): Promise<string> {
  const credential = await signInWithPopup(auth, new GoogleAuthProvider());
  return credential.user.getIdToken();
}
