import { Suspense } from "react";
import SignInForm from "./SignInForm";

export const metadata = {
  title: "Sign In · Webiox QR Studio",
  description: "Sign in to your Webiox QR Studio account.",
};

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
