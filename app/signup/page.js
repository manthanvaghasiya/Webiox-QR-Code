import { Suspense } from "react";
import SignUpForm from "./SignUpForm";

export const metadata = {
  title: "Sign Up · Webiox QR Studio",
  description: "Create your free Webiox QR Studio account.",
};

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
