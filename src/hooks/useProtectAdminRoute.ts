import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminSession } from "@/lib/api"; // must return { success, data: { isAdmin } }

export const useProtectAdminRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await checkAdminSession();
        if (!res.success || !res.data?.isAdmin) {
          // alert("Session expired or unauthorized access.");
          navigate("/", { replace: true });
        }
      } catch (err) {
        alert("Error validating session.");
        navigate("/", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);
};
