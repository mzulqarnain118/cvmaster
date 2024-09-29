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
  Checkbox,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreatePlan, useUpdatePlan, useDeletePlan } from "@/client/services/plan";
import { useDialog } from "@/client/stores/dialog";

const formSchema = createPlanSchema.extend({ id: idSchema.optional() });

type FormValues = z.infer<typeof formSchema>;

type Duration = "month" | "quarterly" | "sixMonths" | "year" | "days";

export const PlanDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<PlanDto>("plan");

  const isCreate = mode === "create";
  const isUpdate = mode === "update";
  const isDelete = mode === "delete";

  const { createPlan, loading: createLoading } = useCreatePlan();
  const { updatePlan, loading: updateLoading } = useUpdatePlan();
  const { deletePlan, loading: deleteLoading } = useDeletePlan();

  const [showDays, setShowDays] = useState(false);

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
      days: 1,
      trialPeriod: 0,
    },
  });

  useEffect(() => {
    if (isOpen) onReset();
  }, [isOpen, payload]);

  const onDelete = async () => {
    if (!payload.item?.id) return;
    await deletePlan({ id: payload.item.id });
    close();
  };

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
        id: payload.item.id,
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

    close();
  };

  const onReset = () => {
    if (isCreate) {
      form.reset({
        name: "",
        price: 0,
        currency: "$",
        description: "",
        status: true,
        duration: "month",
        days: 1,
        trialPeriod: 0,
      });
      setShowDays(false);
    }

    if (isUpdate) {
      form.reset({
        id: payload.item?.id,
        name: payload.item?.name,
        price: payload.item?.price ? parseFloat(payload.item?.price) : 0,
        currency: payload.item?.currency,
        description: payload.item?.description,
        status: payload.item?.status,
        duration: payload.item?.duration,
        days: payload.item?.days ? parseInt(payload.item?.days) : 1,
        trialPeriod: payload.item?.trialPeriod ? parseInt(payload.item?.trialPeriod) : 0,
      });
      setShowDays(payload.item?.duration == "days");
    }

    if (isDelete) form.reset({ id: payload.item?.id });
  };

  const onDurationChange = (value: Duration) => {
    if (value != "days") form.setValue("days", 1);
    form.setValue("duration", value);
    setShowDays(value == "days");
  };

  if (isDelete) {
    return (
      <AlertDialog open={isOpen} onOpenChange={close}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Are you sure you want to delete this plan?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {`This action cannot be undone. This will permanently delete the plan and cannot be recovered.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
            <AlertDialogAction variant="error" onClick={onDelete}>
              {t`Delete`}
            </AlertDialogAction>
          </AlertDialogFooter>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input {...field} className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input
                        {...field}
                        type="number"
                        className="flex-1"
                        onChange={(e) =>
                          form.setValue(
                            "price",
                            e.currentTarget.value
                              ? parseFloat(e.currentTarget.value)
                              : ("" as unknown as number),
                          )
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input {...field} className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="duration"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Select
                        value={field.value}
                        onValueChange={(value: Duration) => onDurationChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t`Format`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Monthly</SelectItem>
                          <SelectItem value="quarterly">Every 3 months</SelectItem>
                          <SelectItem value="sixMonths">Every 6 months</SelectItem>
                          <SelectItem value="year">Yearly</SelectItem>
                          <SelectItem value="days">Day(s)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showDays && (
              <FormField
                name="days"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between gap-x-2">
                        <Input
                          {...field}
                          type="number"
                          className="flex-1"
                          onChange={(e) =>
                            form.setValue(
                              "days",
                              e.currentTarget.value
                                ? parseInt(e.currentTarget.value)
                                : ("" as unknown as number),
                            )
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* <FormField
              name="trialPeriod"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trial Period</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input
                        {...field}
                        type="number"
                        className="flex-1"
                        onChange={(e) =>
                          form.setValue(
                            "trialPeriod",
                            e.currentTarget.value
                              ? parseInt(e.currentTarget.value)
                              : ("" as unknown as number),
                          )
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Checkbox
                        id="plan.status"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          form.setValue("status", checked as boolean);
                        }}
                      />
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
