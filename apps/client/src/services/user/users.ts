import { UserDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { USERS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchUsers = async () => {
  const response = await axios.get<UserDto[], AxiosResponse<UserDto[]>>("/user");
  return response.data;
};

export const useUsers = () => {
  const {
    error,
    isPending: loading,
    data: users,
  } = useQuery({
    queryKey: USERS_KEY,
    queryFn: fetchUsers,
  });

  return { users, loading, error };
};
