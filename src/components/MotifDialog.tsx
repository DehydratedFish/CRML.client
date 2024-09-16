import React, { FormEvent, useRef } from "react";
import { TfiDownload, TfiTrash } from "react-icons/tfi";
import { toast } from "react-toastify";

import Dialog from "./basic/Dialog";
import { Motif, PaymentKind, axiosDeleteMotifFile } from "../models/Motif";
import { CRUDKind } from "../helper";


interface Props {
    motif: Motif;
    onChange: (m: Motif, kind?: CRUDKind, attachments?: File[]) => void;

    openElement: React.JSX.Element;
}


export const MotifDialog = ({motif, onChange, openElement}: Props): React.JSX.Element => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const saveMotif = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newMotif: Motif = {
            id: motif.id,
            titel: e.currentTarget.titel.value,
            description: e.currentTarget.description.value,
            customerId: motif.customerId,
            attachments: motif.attachments,
        };

        let attachmentList: File[] | undefined = undefined;

        const fileList = e.currentTarget.files.files;
        if (fileList.length) {
            attachmentList = Array.from(fileList);
        }

        onChange(newMotif, undefined, attachmentList);

        dialogRef.current!.close();
        e.currentTarget.reset();
    };

    const deleteAttachment = async (motif: Motif, name: string) => {
        await axiosDeleteMotifFile(["/api/motif/attachment", motif.id, name])
            .then (() => {
                motif.attachments = motif.attachments.splice(motif.attachments.indexOf(name), 1);
                onChange(motif);
            })
            .catch(() => toast(`Could not delete file ${name}.`));
    }

    const attachmentList = motif.attachments.map((fileName: string) => {
        return (
            <div className="flex pad" key={fileName}>
                <div className="flex_grow">{fileName}</div>
                <a href={`/api/motif/attachment/${motif.id}/${fileName}`}><TfiDownload /></a>
                <TfiTrash onClick={() => deleteAttachment(motif, fileName)} />
            </div>
        )
    });

    return (
        <Dialog ref={dialogRef} openElement={openElement} className="pad">
            <form onSubmit={saveMotif} className="flex_list flex_gap">
                <label>Titel:
                    <input name="titel" type="text" required defaultValue={motif.titel} />
                </label>
                <label>Beschreibung:
                    <textarea name="description" defaultValue={motif.description} />
                </label>
                <label>Stelle:
                    <input name="position" type="text" defaultValue={motif.position} />
                </label>
                <label>Zahlart:
                    <select name="payment" defaultValue={motif.payment}>
                        <option value={PaymentKind.Hourly}>Stundensatz</option>
                        <option value={PaymentKind.Fixed}>Festbetrag</option>
                    </select>
                </label>
                <label>
                    <input name="deposit" type="number" defaultValue={motif.deposit} />
                </label>
                <input name="files" type="file" multiple />

                <button type="submit">Speichern</button>
            </form>

            

            {attachmentList}
        </Dialog>
    );
}

export default MotifDialog;

