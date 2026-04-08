import FullPageLoader from "@/shared/ui/full-page-loader";
import { useNavigate } from "react-router-dom";
import useVerifyEmail from "@/domains/auth/hooks/use-verify-email";
import { useEffect } from "react";
import { handleApiError } from "@/shared/utils/api/errors";
import { toast } from "sonner";

export default function CompleteSignupRoute() {
  const { mutateAsync: verifyEmail } = useVerifyEmail();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVerifyEmail = async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      if (token) {
        try {
          await verifyEmail(token);
          toast.success("Email verified successfully");
          navigate("/dashboard");
        } catch (error) {
          handleApiError(error, { showToast: true });
          navigate("/auth/signup");
        }
      }
    };

    handleVerifyEmail();
  }, [verifyEmail, navigate]);

  return <FullPageLoader />;
}
