import { Link, useParams } from "react-router-dom";
import { TfiUser, TfiAlarmClock } from "react-icons/tfi";
import { ChangeEvent, ReactNode, cloneElement, useRef, useState } from "react";
import ReactDOM from "react-dom";

import useSWR from "swr"
import { FadeLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";



// NOTE: Dates need to be converted or else they are in the wrong format (JSON).
const axiosGetAppointments = async ([url, customerId]: [string, number]) => {
    return axios.get<Appointment[]>(url, {params: {id: customerId}})
        .then((response) => {
            const result = response.data;

            result.forEach((a: Appointment) => {
                a.start = new Date(a.start);
                a.end   = new Date(a.end);
            })

            return result;
        });
}


export const Navigation = (): JSX.Element => {
    return (
        <div className="flex gap-1 p-2">
            <div><Link className="p-1 border-solid border-r-2 border-r-violet-600" to="/">Übersicht</Link></div>
            <div><Link className="p-1" to="/customer">Kunden</Link></div>
        </div>
    )
}


type Appointment = {
    id: number;
    start: Date;
    end: Date;

    kind: string;
    customerId: number;
};

type Customer = {
    id: number;
    name: string;
    date: Date;

    appointments: Appointment[];
};


interface CustomerProps {
    customer: Customer;
}

export const CustomerPreview = (p: CustomerProps): JSX.Element => {
    return (
        <Link to={"/customer/" + p.customer.id} className="block w-full shadow border rounded-md hover:text-white hover:bg-small_customer_bg">
            <div className="flex items-center"><TfiUser className="m-1" />Name: {p.customer.name}</div>
            <div className="flex items-center"><TfiAlarmClock className="m-1" />Letzter Termin: {p.customer.date.toLocaleString()}</div>
        </Link>
    )
}

export const CustomerPreviewList = (): JSX.Element => {
    const {data: customers, isLoading} = useSWR<Customer[]>("/api/customer");

    if (isLoading) return <FadeLoader />

    if (!customers) return (
        <div>Netzwerkfehler.</div>
    )

    return (
        <>
            <div className="flex flex-col gap-2 w-full p-4 items-center">
                {customers.map((customer: Customer) => (
                    <CustomerPreview key={customer.id} customer={customer} />
                ))}
            </div>
        </>
    )
}


const TimeDiff = (start: Date, end: Date): string => {
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    return `${hours.toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
}

interface AppointmentListProps {
    customerId: number;
}

export const AppointmentList = (p: AppointmentListProps): JSX.Element => {
    const {data: appointments, error, isLoading, mutate} = useSWR(["/api/appointment", p.customerId], axiosGetAppointments);

    if (isLoading || !appointments) return <FadeLoader />;
    if (error) return <div>Keine Termine geladen.</div>;

    const updateAppointment = (index: number, updated: Appointment): void => {
        const next = appointments.slice();
        next[index] = updated;
        mutate(next);
    }

    const editButton = <button className="float-right">Edit</button>;

    return (
        <div className="flex flex-col gap-1">
            {appointments.map((a: Appointment, index: number)=> (
                <div key={a.id} className="border border-black p-1">
                    Termin: {a.start.toLocaleString()}
                    <br />
                    Dauer: {TimeDiff(a.start, a.end)}
                    <AppointmentDialog appointment={a} onUpdate={(a: Appointment) => updateAppointment(index, a)} clickable={editButton} />
                </div>
            ))}
        </div>
    )
}


interface ModalProps {
    visible: boolean;
    children: ReactNode;
}

export const Modal = (p: ModalProps): JSX.Element => {
    if (!p.visible) return <></>;

    return ReactDOM.createPortal(
        <>
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/70" />
            <div className="max-h-[90%] max-w-[90%] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-1 border border-white bg-white">
                {p.children}
            </div>
        </>,
        document.getElementById("overlay")!
    )
}

interface AppointmentDialogProps {
    appointment: Appointment;
    onUpdate: (a: Appointment) => void;
    clickable: JSX.Element;
}

// TODO: Add a 'customClose' prop that is a JSX.Element too so you can customise the close button.
export const AppointmentDialog = (p: AppointmentDialogProps): JSX.Element => {
    const [visible, setVisible] = useState<boolean>(false);
    const [start,   setStart]   = useState<Date>(p.appointment.start);
    const [end,     setEnd]     = useState<Date>(p.appointment.end);
    const [kind,    setKind]    = useState<string>(p.appointment.kind);

    // NOTE: The clickable needs to be cloned because the onClick prop of JSX.Element is read-only.
    const clickable = cloneElement(p.clickable, {onClick: (): void => {setVisible(true)}});

    const saveAppointment = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        let appointment: Appointment = {
            id: p.appointment.id,
            kind: kind,
            start: start,
            end: end,
            customerId: p.appointment.customerId
        };

        // TODO: If .id is 0 then Post a new appointment else Put and update the old one.
        const fetchPost = ([url, params]: [string, any?]) => {
            return axios.put<Appointment>(url, params);
        }

        await fetchPost(["/api/appointment", appointment])
            .then(() => {p.onUpdate(appointment)})
            .catch((error) => toast(error));

        setVisible(false);
    }

    // TODO: Use the <diolog> element?
    return (
        <>
            {clickable}
            <Modal visible={visible}>
                <button className="float-end" onClick={(): void => setVisible(false)}>X</button>
                <form className="flex flex-col">
                    <label>
                        Art:
                        <select name="kind" value={kind} onChange={(value: ChangeEvent<HTMLSelectElement>) => setKind(value.target.value)}>
                            <option value={"consult"}>Beratung</option>
                            <option value={"tattoo"}>Stechen</option>
                        </select>
                    </label>
                    <label>
                        Begin:
                        <input type="datetime-local" value={start.toISOString().slice(0, 16)} onChange={(event: ChangeEvent<HTMLInputElement>) => setStart(new Date(event.target.value + ":00Z"))} />
                    </label>
                    <label>
                        Ende:
                        <input type="datetime-local" value={end.toISOString().slice(0, 16)} onChange={(event: ChangeEvent<HTMLInputElement>) => setEnd(new Date(event.target.value + ":00Z"))} />
                    </label>

                    <button type="submit" onClick={saveAppointment}>Speichern</button>
                </form>
            </Modal>
        </>
    )
}



/******************************************************************************
 * Pages
 *****************************************************************************/

export const Overview = (): JSX.Element => {
    return (
        <>
        </>
    )
}


// TODO: It would be better to have an endpoint that only returns the fields needed for the previews.
//       If appointments and files are added later to each customer its maybe not so great to return them here.
//       Well... they don't have to be in the regular customer, maybe. Need to get more familiar with ASP.NET Core.
//
export const CustomerManagement = (): JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        console.log(inputRef);
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input ref={inputRef} type="text" />
                <button type="submit">Suche</button>
            </form>

            <CustomerPreviewList />
        </>
    )
}

export const CustomerDetail = (): JSX.Element => {
    const params = useParams();

    const {data: customer, isLoading} = useSWR<Customer>(`/api/customer/${params.id}`);

    if (isLoading) return <FadeLoader />
    if (!customer) return <div>Netzwerkfehler.</div>

    return (
        <div className="p-2" >
            {customer.name}
            {new Date(customer.date).toLocaleString()}

            <div>
                Termine:
                <AppointmentList customerId={customer.id} />
            </div>
        </div>
    )
}

