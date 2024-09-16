import { FadeLoader } from "react-spinners";
import useSWR from "swr";

import Customer, { axiosGetCustomers } from "../models/Customer";
import CustomerPreview from "./CustomerPreview";


export const CustomerPreviewList = (): JSX.Element => {
    const {data: customers, error, isLoading} = useSWR("/api/customer", axiosGetCustomers);

    if (isLoading) return <FadeLoader />

    if (error || !customers) return (
        <div>Netzwerkfehler.</div>
    )

    return (
        <div className="flex_list flex_gap">
            {customers.map((customer: Customer) => (
                <CustomerPreview key={customer.id} customer={customer} />
            ))}
        </div>
    )
}

export default CustomerPreviewList;

