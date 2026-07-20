import { z } from "zod";

export const updateReservationSchema = z.object({
    tableId: z
        .number()
        .gte(1, "Please select a table"),
    date: z
        .string()
        .min(1, "This field is required"),
    timeSlotId: z
        .number()
        .gte(1, "Please select a time slot"),
    status: z
        .string()
        .min(1, "Please select a status")
})

export type UpdateReservationFormInput = z.input<typeof updateReservationSchema>;
export type UpdateReservationFormOutput = z.output<typeof updateReservationSchema>;