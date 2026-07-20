import { z } from "zod";

export const reservationSchema = z.object({
    name : z
        .string()
        .trim()
        .min(1,"This field is required"),
    tableId : z
        .number({ error : "Please select a table" })
        .gte(1,"Please select a table"),
    phoneNo: z
        .string()
        .trim()
        .transform(val => val.replace(/[\s\-]/g, ""))
        .pipe(
            z.string().regex(/^(?:\+?60|0)[0-9]{8,10}$/, "Invalid phone number")
        ),
    date : z
        .string()
        .min(1, "This field is required")
        .refine(val => val >= new Date().toISOString().split("T")[0], {
            message: "Date cannot be in the past"
        }),
    timeSlotId : z
        .number()
        .gte(1,"Please select a time slot"),
})

export type ReservationFormInput = z.input<typeof reservationSchema>;
export type ReservationFormOutput = z.output<typeof reservationSchema>;