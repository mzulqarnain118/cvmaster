import { PlanDto, UpdatePlanDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import debounce from "lodash.debounce";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const updatePlan = async (data: UpdatePlanDto) => {
  const response = await axios.patch<PlanDto, AxiosResponse<PlanDto>, UpdatePlanDto>(
    `/subscription/plan/${data.id}`,
    data,
  );

  queryClient.setQueryData<PlanDto>(["plan", { id: response.data.id }], response.data);
  queryClient.setQueryData<PlanDto[]>(["plans"], (cache) => {
    if (!cache) return [response.data];
    return cache.map((plan) => {
      if (plan.id === response.data.id) return response.data;
      return plan;
    });
  });

  return response.data;
};

export const debouncedUpdatePlan = debounce(updatePlan, 500);

export const useUpdatePlan = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updatePlanFn,
  } = useMutation({
    mutationFn: updatePlan,
  });

  return { updatePlan: updatePlanFn, loading, error };
};
