import { SignupFormContainer } from "@/domains/auth/ui/signup-form-container";
import { AnimatedThemeToggler } from "@/shared/ui/animated-theme-toggler";

export default function SignupRoute() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <SignupFormContainer />
        <AnimatedThemeToggler />
      </div>
    </div>
  );
}
