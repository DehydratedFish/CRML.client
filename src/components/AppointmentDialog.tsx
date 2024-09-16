import React, { FormEvent, useRef } from "react";
import { toast } from "react-toastify";

import Dialog from "./basic/Dialog";
import Appointment, { AppointmentKind, axiosPutAppointment } from "../models/Appointment";


interface Props {
    appointment: Appointment;
    onUpdate: (a: Appointment) => void;
    clickable: JSX.Element;
}

export const AppointmentDialog = ({appointment, onUpdate, clickable}: Props): React.JSX.Element => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const saveAppointment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const newAppointment: Appointment = {
            id: appointment.id,
            kind: formData.get("kind") as AppointmentKind,
            start: new Date(formData.get("start") as string + ":00Z"),
            end: new Date(formData.get("end") as string + ":00Z"),
            customerId: appointment.customerId,
            motifId: appointment.motifId,
        };

        // TODO: If .id is 0 then Post a new appointment else Put and update the old one.
        await axiosPutAppointment(["/api/appointment", newAppointment])
            .then((response) => onUpdate(response.data))
            .catch((error) => toast(error));

        dialogRef.current!.close();
    }

    return (
        <>
            <Dialog ref={dialogRef} openElement={clickable} className="pad">
                <form onSubmit={saveAppointment} className="flex_list flex_gap">
                    <select name="kind" defaultValue={appointment.kind}>
                        <option value={AppointmentKind.consult}>Beratung</option>
                        <option value={AppointmentKind.tattoo}>Stechen</option>
                    </select>
                    <label>
                        Begin:
                        <input name="start" type="datetime-local" defaultValue={appointment.start.toISOString().slice(0, 16)} />
                    </label>
                    <label>
                        Ende:
                        <input name="end" type="datetime-local" defaultValue={appointment.end.toISOString().slice(0, 16)} />
                    </label>

                    <button type="submit">Speichern</button>
                </form>
            </Dialog>
        </>
    )
}

export default AppointmentDialog;

