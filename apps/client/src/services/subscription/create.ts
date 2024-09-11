import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { fetchUser } from "../user";
import { useAuthStore } from "@/client/stores/auth";
import { queryClient } from "@/client/libs/query-client";

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
    onSuccess: async (data) => {
      const updatedUser = await fetchUser();
      useAuthStore.getState().setUser(updatedUser ?? null);
      queryClient.setQueryData(["user"], updatedUser);

      return data;
    },
  });

  return { createSubscription: createSubscriptionFn, loading, error };
};
