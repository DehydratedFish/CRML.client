import React from "react";
import { TfiAlarmClock, TfiCalendar, TfiMarker, TfiPencil } from "react-icons/tfi";

import AppointmentDialog from "./AppointmentDialog";
import Appointment from "../models/Appointment";


const timeDiff = (start: Date, end: Date): string => {
    const diff    = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours   = Math.floor(minutes / 60);

    return `${hours.toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
}

interface Props {
    appointment: Appointment
    onUpdate: (a: Appointment) => void;
}

export const AppointmentItem = ({appointment, onUpdate}: Props): React.JSX.Element => {
    const editButton = <button className="position_top_right"><TfiPencil /></button>;

    return (
        <div key={appointment.id} className="appointment pad">
            <div className="pad-y"><TfiCalendar />{appointment.start.toLocaleString()}</div>
            <div className="pad-y"><TfiAlarmClock />{timeDiff(appointment.start, appointment.end)}</div>
            <div className="pad-y"><TfiMarker />{appointment.kind}</div>
            <AppointmentDialog appointment={appointment} onUpdate={onUpdate} clickable={editButton} />
        </div>
    );
}

export default AppointmentItem;

