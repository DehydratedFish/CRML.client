import React, { useRef } from "react";

import CustomerPreviewList from "../CustomerPreviewList";
import { TfiSearch } from "react-icons/tfi";


// TODO: It would be better to have an endpoint that only returns the fields needed for the previews.
//       If appointments and files are added later to each customer its maybe not so great to return them here.
//       Well... they don't have to be in the regular customer, maybe. Need to get more familiar with ASP.NET Core.
export const CustomerManagement = (): React.JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(inputRef);
    }

    return (
        <div className="pad">
            <form onSubmit={onSubmit} className="search_form">
                <input ref={inputRef} type="text" />
                <button type="submit" className="pad" ><TfiSearch size="1.2rem" /></button>
            </form>

            <CustomerPreviewList />
        </div>
    )
}

export default CustomerManagement;

