import axios from "axios";



type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    hasWA: boolean;
};


export const axiosGetCustomer = async ([url, id]: [string, number]) => {
    return axios.get<Customer>(`${url}/${id}`)
        .then((response) => {
            return response.data;
        });
}

export const axiosGetCustomers = async (url: string) => {
    return axios.get<Customer[]>(url)
        .then((response) => {
            return response.data;
        });
}


export default Customer;
