import axios from "axios";


export enum PaymentKind {
    Hourly,
    Fixed,
};

export type Motif = {
    id: number;
    titel: string;
    description: string;
    position: string;
    payment: PaymentKind
    amount: number;
    deposit: number;
    customerId: number;

    attachments: string[];
};


export const axiosGetMotifs = async ([url, id]: [string, number]) => {
    return axios.get<Motif[]>(url, {params: {customerId: id}})
        .then((response) => response.data);
}

export const axiosPostMotif = async ([url, motif]: [string, Motif]) => {
    return axios.post<Motif>(url, motif)
        .then((response) => response.data);
}

export const axiosPutMotif = async ([url, motif]: [string, Motif]) => {
    return axios.put<Motif>(url, motif)
        .then((response) => response.data);
}

export const axiosDeleteMotif = async ([url, id]: [string, number]) => {
    return axios.delete(`${url}/${id}`)
        .then((response) => response.data);
}

export const axiosPostMotifFiles = async ([url, id, formData]: [string, number, FormData]) => {
    return axios.post(`${url}/${id}`, formData, {headers: {"Content-Type": "multipart/form-data"}})
        .then((response) => response.data);
}

export const axiosGetMotifFile = async ([url, id, fileName]: [string, number, string]) => {
    return axios.get(`${url}/${id}/${fileName}`, {responseType: "blob"})
        .then ((response) => {
            const blob = new Blob([response.data], {type: response.headers["Content-Type"] as string});
            const url  = window.URL.createObjectURL(blob);

            const tmpLink = document.createElement("a");
            tmpLink.href = url;
            tmpLink.setAttribute("download", fileName);

            document.body.appendChild(tmpLink);
            tmpLink.click();
            document.body.removeChild(tmpLink);
            window.URL.revokeObjectURL(url);
        });
}

export const axiosDeleteMotifFile = async ([url, id, fileName]: [string, number, string]) => {
    return axios.delete(`${url}/${id}/${fileName}`);
}

export default Motif;
