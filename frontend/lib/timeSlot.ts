import { TimeSlot } from "@/types/timeSlot";
import api from "./axios"

export async function getTimeSlots() : Promise<TimeSlot[]>{
    const res = await api.get<TimeSlot[]>("/timeslots");
    return res.data;
}

export async function createTimeSlot(startTime: string){
    await api.post("/timeslots", {startTime});
}

export async function deleteTimeSlot(id: number){
    await api.delete(`/timeslots/${id}`);
}