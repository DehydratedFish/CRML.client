import { useParams } from "react-router";
import { FadeLoader } from "react-spinners";
import useSWR from "swr";

import Expandable from "../Expandable";
import AppointmentList from "../AppointmentList";
import MotifList from "../MotifList";
import { axiosGetCustomer } from "../../models/Customer";
import { TfiEmail, TfiUser } from "react-icons/tfi";
import { RiPhoneFill, RiWhatsappFill } from "react-icons/ri";


export const CustomerDetail = (): JSX.Element => {
    const params = useParams();

    // TODO: Check if params.customerId is actually a number.
    const {data: customer, error, isLoading} = useSWR(["/api/customer", Number(params.id)], axiosGetCustomer);

    if (isLoading) return <FadeLoader />
    if (error || !customer) return <div>Netzwerkfehler.</div>

    const phoneIcon = customer.hasWA ? <RiWhatsappFill /> : <RiPhoneFill />;

    return (
        <div className="customer_detail pad">
            <div className="position_top_right faded_text">#{customer.id}</div>

            <div className="flex pad-y"><TfiUser /> <div className="flex_grow">{customer.name}</div></div>
            <div className="flex pad-y"><TfiEmail /><div className="flex_grow">{customer.email}</div></div>
            <div className="flex pad-y">{phoneIcon} <div className="flex_grow">{customer.phone}</div></div>

            <div>
                <Expandable title="Termine" className="expand_blue">
                    <AppointmentList customerId={customer.id} />
                </Expandable>
                <Expandable title="Motive" className="expand_blue">
                    <MotifList customerId={customer.id} />
                </Expandable>
            </div>
        </div>
    )
}

export default CustomerDetail;

