import { PlanDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PLANS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchPlans = async () => {
  const response = await axios.get<PlanDto[], AxiosResponse<PlanDto[]>>("/subscription/plan");
  return response.data;
};

export const usePlans = () => {
  const {
    error,
    isPending: loading,
    data: plans,
  } = useQuery({
    queryKey: PLANS_KEY,
    queryFn: fetchPlans,
  });

  return { plans, loading, error };
};
