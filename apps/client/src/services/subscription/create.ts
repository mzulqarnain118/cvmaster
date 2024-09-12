import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { fetchUser } from "../user";
import { useAuthStore } from "@/client/stores/auth";
import { queryClient } from "@/client/libs/query-client";
import { toast } from "@/client/hooks/use-toast";
import { t } from "@lingui/macro";
import { CreditCard } from "@phosphor-icons/react";
import { printResume } from "../resume";
import { useResumeStore } from "@/client/stores/resume";
import { openInNewTab } from "@reactive-resume/utils";

export const createSubscription = async (id: string) => {
  const response = await axios.post("/subscription", { id });
  return response.data;
};

export const useCreateSubscription = () => {
  const resumeId = useResumeStore((state) => state.resume.id);

  const {
    error,
    isPending: loading,
    mutateAsync: createSubscriptionFn,
  } = useMutation({
    mutationFn: createSubscription,
    onSuccess: async (data) => {
      const updatedUser = await fetchUser();
      useAuthStore.getState().setUser(updatedUser ?? null);
      queryClient.setQueryData(["user"], updatedUser);
      toast({
        variant: "success",
        title: t`Subscription Activated`,
        description: t`Thanks for the payment. Your resume has been downloaded in PDF format successfully.`,
      });
      const {url} = await printResume({id:resumeId})

      openInNewTab(url)
      return data;
    },
  });

  return { createSubscription: createSubscriptionFn, loading, error };
};
