import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";

export const attachPaymentMethod = async ({
  source,
  type,
}: {
  source: string;
  type: "applePay" | "card";
}) => {
  const response = await axios.post("/subscription/payment-method/attach", { source, type });
  return response.data;
};

export const useAttachPaymentMethod = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: attachPaymentMethodFn,
  } = useMutation({
    mutationFn: attachPaymentMethod,
    onSuccess: (data) => data,
  });

  return { attachPaymentMethod: attachPaymentMethodFn, loading, error };
};
