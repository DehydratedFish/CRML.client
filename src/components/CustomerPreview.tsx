import React from "react";
import { Link } from "react-router-dom";
import { TfiUser } from "react-icons/tfi";

import Customer from "../models/Customer";


interface Props {
    customer: Customer;
}

export const CustomerPreview = ({customer}: Props): React.JSX.Element => {
    return (
        <Link to={"/customer/" + customer.id} className="customer_preview pad">
            <TfiUser className="" /><div className="flex_grow">{customer.name}</div><div className="faded_text">#{customer.id}</div>
        </Link>
    )
}

export default CustomerPreview;

