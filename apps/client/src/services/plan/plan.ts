import { PlanDto } from "@reactive-resume/dto";
import { axios } from "@/client/libs/axios";

export const findPlanById = async (data: { id: string }) => {
  const response = await axios.get<PlanDto>(`/subscription/plan/${data.id}`);
  return response.data;
};
