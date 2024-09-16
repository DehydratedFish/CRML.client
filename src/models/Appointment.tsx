import axios from "axios";

export enum AppointmentKind {
    consult = "Beratung",
    tattoo  = "Stechen",
};

export type Appointment = {
    id: number;
    start: Date;
    end: Date;

    kind: AppointmentKind;
    customerId: number;
    motifId: number;
};


export const axiosGetAppointments = async ([url, id]: [string, number]) => {
    return axios.get<Appointment[]>(url, {params: {customerId: id}})
        .then((response) => {
            const result = response.data;

            result.forEach((a: Appointment) => {
                a.start = new Date(a.start);
                a.end   = new Date(a.end);
            })

            return result;
        });
}

export const axiosPutAppointment = async ([url, appointment]: [string, Appointment]) => {
    return axios.put<Appointment>(url, appointment)
        .then((response) => {
            response.data.start = new Date(response.data.start);
            response.data.end   = new Date(response.data.end);

            return response;
        });
}

export default Appointment;

