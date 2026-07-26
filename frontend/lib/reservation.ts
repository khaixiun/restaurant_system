import { reservationSchema } from "@/schemas/reservation";
import { Reservation } from "@/types/reservation";
import { z } from "zod";
import api from "./axios";
import { updateReservationSchema } from "@/schemas/updateReservation";
import { TableAvailability } from "@/types/tableAvailability";

type ReservationPayload = z.infer<typeof reservationSchema>;
type UpdateReservationPayload = z.infer<typeof updateReservationSchema>;

export async function getReservations() : Promise<Reservation[]> {
    const res = await api.get<Reservation[]>("/reservation");
    return res.data;
}

export async function createReservation(data: ReservationPayload) {
    await api.post("/reservation", data);
}

export async function updateReservation(id: number, data: UpdateReservationPayload) {
    await api.put(`/reservation/${id}`, data);
}

export async function deleteReservation(id: number) {
    await api.delete(`/reservation/${id}`);
}

export async function getTableAvailability(date: string, timeSlotId: number): Promise<TableAvailability[]> {
    const res = await api.get<TableAvailability[]>(`/reservation/availability?date=${date}&timeSlotId=${timeSlotId}`);
    return res.data;
}