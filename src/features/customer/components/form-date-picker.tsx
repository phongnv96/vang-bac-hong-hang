"use client";

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { Control, ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type FormDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  disabled?: boolean;
  triggerClassName?: string;
};

function DatePickerControl<T extends FieldValues>({
  field,
  label,
  disabled,
  triggerClassName,
}: {
  field: ControllerRenderProps<T, FieldPath<T>>;
  label: string;
  disabled?: boolean;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const parsed =
    field.value && typeof field.value === "string"
      ? parseISO(field.value)
      : undefined;
  const selected = parsed && isValid(parsed) ? parsed : undefined;

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "h-11 w-full justify-start text-left font-normal md:h-9",
                !field.value && "text-muted-foreground",
                triggerClassName
              )}
            >
              <CalendarIcon className="mr-2 size-4 shrink-0 opacity-70" />
              {selected ? (
                format(selected, "d MMMM yyyy", { locale: vi })
              ) : (
                <span>Chọn ngày</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="z-100 w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              field.onChange(date ? format(date, "yyyy-MM-dd") : "");
              setOpen(false);
            }}
            defaultMonth={selected}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  triggerClassName,
}: FormDatePickerProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <DatePickerControl
          field={field}
          label={label}
          disabled={disabled}
          triggerClassName={triggerClassName}
        />
      )}
    />
  );
}
