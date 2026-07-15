import {z} from 'zod';

export const foodSchema = z.object({
    name : z
        .string()
        .trim()
        .min(1,"This field is required"),
    description : z
        .string()
        .transform(val => val.trim() || null)
        .optional(),
    price : z
        .number()
        .gte(0.01, "The starting price is atleast 0.01"),
    imageUrl : z
        .string()
        .transform(val => val.trim() || null)
        .optional(),
    categoryId : z
        .number()
        .min(1,"Please select a category")
})

export type FoodFormInput = z.input<typeof foodSchema>;
export type FoodFormOutput = z.output<typeof foodSchema>;