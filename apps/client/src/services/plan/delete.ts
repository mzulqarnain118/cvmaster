import { DeletePlanDto, PlanDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const deletePlan = async (data: DeletePlanDto) => {
  const response = await axios.delete<PlanDto, AxiosResponse<PlanDto>, DeletePlanDto>(
    `/subscription/plan/${data.id}`,
  );

  return response.data;
};

export const useDeletePlan = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deletePlanFn,
  } = useMutation({
    mutationFn: deletePlan,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["plan", data.id] });
      queryClient.setQueryData<PlanDto[]>(["plans"], (cache) => {
        if (!cache) return [];
        return cache.filter((plan) => plan.id !== data.id);
      });
    },
  });

  return { deletePlan: deletePlanFn, loading, error };
};
