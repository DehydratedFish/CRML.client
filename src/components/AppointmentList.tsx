import React from "react";
import { FadeLoader } from "react-spinners";
import useSWR from "swr";

import Appointment, { axiosGetAppointments } from "../models/Appointment";
import AppointmentItem from "./AppointmentItem";


interface Props {
    customerId: number;
}

export const AppointmentList = ({customerId}: Props): React.JSX.Element => {
    const {data: appointments, error, isLoading, mutate} = useSWR(["/api/appointment", customerId], axiosGetAppointments);

    if (isLoading || !appointments) return <FadeLoader />;
    if (error) return <div>Keine Termine geladen.</div>;

    if (appointments.length === 0) return <>Keine Termine.</>

    const updateAppointment = (index: number, updated: Appointment): void => {
        mutate((prev) => {
            if (prev) {
                prev[index] = updated

                return prev;
            }
        });
    }

    const drawList = appointments.map((a: Appointment, index: number) => <AppointmentItem key={a.id} appointment={a} onUpdate={(a: Appointment) => updateAppointment(index, a)} />)

    return (
        <div className="flex_list">
            {drawList}
        </div>
    )
}

export default AppointmentList;

