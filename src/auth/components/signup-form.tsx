import { handleApiError } from "@/shared/utils/api/errors";
import useSignupWithEmail from "@/auth/hooks/use-signup-with-email";
import { SignupForm, type ISignupFormValues } from "@/auth/ui/signup-form";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function SignupFormContainer() {
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  const { mutateAsync: signup, isPending } = useSignupWithEmail();

  const handleSignup = async (values: ISignupFormValues) => {
    try {
      await signup(values);
      toast.success("Account created successfully");
      setShowSuccessCard(true);
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  if (showSuccessCard) {
    return (
      <div>
        <Card>
          <CardHeader className="flex flex-col items-center gap-4">
            <img src="/email-sent.svg" alt="Email Sent" />
            <CardTitle>Account created successfully!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p>Please check your email for a verification link</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <SignupForm onSubmit={handleSignup} loading={isPending} />;
}
