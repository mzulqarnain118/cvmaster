import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { fetchUser } from "../user";
import { useAuthStore } from "@/client/stores/auth";
import { queryClient } from "@/client/libs/query-client";
import { toast } from "@/client/hooks/use-toast";
import { printResume } from "../resume";
import { useResumeStore } from "@/client/stores/resume";
import { openInNewTab } from "@reactive-resume/utils";

export const createSubscription = async (payload: any) => {
  const response = await axios.post("/subscription", payload);
  return response.data;
};

export const useCreateSubscription = () => {
  const { id, type } = useResumeStore((state) => state.resume);

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
      if (updatedUser?.planType !== "both" && type !== updatedUser?.planType) {
        toast({
          variant: "info",
          title: `Upgrade your subscription.`,
          description: `Your subscription does not include ${type}.Please upgrade your subsciption for unlocking this feature.`,
        });
        return;
      }
      toast({
        variant: "success",
        title: `Subscription Activated`,
        description: `Thanks for the payment. Your resume has been downloaded in PDF format successfully.`,
      });
      const { url } = await printResume({ id });

      openInNewTab(url);
      return data;
    },
  });

  return { createSubscription: createSubscriptionFn, loading, error };
};
