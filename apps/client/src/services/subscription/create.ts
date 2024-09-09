import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";

export const createSubscription = async (id: string) => {
  const response = await axios.post("/subscription", { id });
  return response.data;
};

export const useCreateSubscription = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createSubscriptionFn,
  } = useMutation({
    mutationFn: createSubscription,
    onSuccess: (data) => data,
  });

  return { createSubscription: createSubscriptionFn, loading, error };
};
