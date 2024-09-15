import { CreatePlanDto, PlanDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createPlan = async (data: CreatePlanDto) => {
  const response = await axios.post<PlanDto, AxiosResponse<PlanDto>, CreatePlanDto>(
    "/subscription/plan",
    data,
  );
  return response.data;
};

export const useCreatePlan = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createPlanFn,
  } = useMutation({
    mutationFn: createPlan,
    onSuccess: (data) => {
      queryClient.setQueryData<PlanDto>(["plan", { id: data.id }], data);
      queryClient.setQueryData<PlanDto[]>(["plans"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createPlan: createPlanFn, loading, error };
};
