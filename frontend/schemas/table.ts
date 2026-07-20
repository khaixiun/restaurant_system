import {z} from 'zod';

export const tableSchema = z.object({
    tableNo : z
        .string()
        .trim()
        .min(1, "This field is required"),
    capacity : z
        .number()
        .gte(1, "This field is required"),
    position : z
        .string()
        .trim()
        .min(1, "This field is required"),
    isReservable : z
        .boolean()
})

export type TableFormInput = z.input<typeof tableSchema>;
export type TableFormOutput = z.output<typeof tableSchema>;