import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { createPlanSchema, PlanDto } from "@reactive-resume/dto";
import { idSchema } from "@reactive-resume/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreatePlan, useUpdatePlan, useDeletePlan } from "@/client/services/plan";
import { useDialog } from "@/client/stores/dialog";

const formSchema = createPlanSchema.extend({ id: idSchema.optional() });

type FormValues = z.infer<typeof formSchema>;

export const PlanDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<PlanDto>("plan");

  const isCreate = mode === "create";
  const isUpdate = mode === "update";
  const isDelete = mode === "delete";

  const { createPlan, loading: createLoading } = useCreatePlan();
  const { updatePlan, loading: updateLoading } = useUpdatePlan();
  const { deletePlan, loading: deleteLoading } = useDeletePlan();

  const loading = createLoading || updateLoading || deleteLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      currency: "$",
      description: "",
      status: true,
      duration: "month",
      days: 0,
      trialPeriod: 0,
    },
  });

  useEffect(() => {
    if (isOpen) onReset();
  }, [isOpen, payload]);

  const onSubmit = async (values: FormValues) => {
    if (isCreate) {
      await createPlan({
        name: values.name,
        price: values.price,
        currency: values.currency,
        description: values.description,
        status: values.status,
        duration: values.duration,
        days: values.days,
        trialPeriod: values.trialPeriod,
      });
    }

    if (isUpdate) {
      if (!payload.item?.id) return;
      await updatePlan({
        ...payload.item,
        name: values.name,
      });
    }

    if (isDelete) {
      if (!payload.item?.id) return;
      await deletePlan({ id: payload.item.id });
    }

    close();
  };

  const onReset = () => {
    if (isCreate)
      form.reset({
        name: "",
        price: 0,
        currency: "$",
        description: "",
        status: true,
        duration: "month",
        days: 0,
        trialPeriod: 0,
      });

    if (isUpdate)
      form.reset({
        id: payload.item?.id,
        name: payload.item?.name,
        price: payload.item?.price,
        currency: payload.item?.currency,
        description: payload.item?.description,
        status: payload.item?.status,
        duration: payload.item?.duration,
        days: payload.item?.days,
        trialPeriod: payload.item?.trialPeriod,
      });

    if (isDelete) form.reset({ id: payload.item?.id });
  };

  if (isDelete) {
    return (
      <AlertDialog open={isOpen} onOpenChange={close}>
        <AlertDialogContent>
          <Form {...form}>
            <form>
              <AlertDialogHeader>
                <AlertDialogTitle>{`Are you sure you want to delete this plan?`}</AlertDialogTitle>
                <AlertDialogDescription>
                  {`This action cannot be undone. This will permanently delete the plan and cannot be recovered.`}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
                <AlertDialogAction variant="error" onClick={form.handleSubmit(onSubmit)}>
                  {t`Delete`}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center space-x-2.5">
                  <Plus />
                  <h2>
                    {isCreate && `Create a new plan`}
                    {isUpdate && `Update an existing plan`}
                  </h2>
                </div>
              </DialogTitle>
            </DialogHeader>

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Name`}</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input {...field} className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex items-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(isCreate && "rounded-r-none")}
                >
                  {isCreate && t`Create`}
                  {isUpdate && t`Save Changes`}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
