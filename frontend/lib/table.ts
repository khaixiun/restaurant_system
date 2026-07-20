import { Table } from "@/types/table";
import api from "./axios";
import { z } from "zod";
import { tableSchema } from "@/schemas/table";

type TablePayload = z.infer<typeof tableSchema>;

export async function getTables() : Promise<Table[]>{
    const res = await api.get<Table[]>("/table");
    return res.data;
}

export async function createTable(data: TablePayload) {
    await api.post("/table", data);
}

export async function updateTable(id: number, data: TablePayload){
    await api.put(`/table/${id}`, data);
}

export async function deleteTable(id : number){
    await api.delete(`/table/${id}`);
}