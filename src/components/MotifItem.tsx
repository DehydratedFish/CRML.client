import React from "react"
import { TfiPencil, TfiTrash } from "react-icons/tfi";

import Motif from "../models/Motif"
import MotifDialog from "./MotifDialog";
import { CRUDKind } from "../helper";


interface Props {
    motif: Motif;
    onChange: (m: Motif, kind?: CRUDKind, attachments?: File[]) => void;
}

export const MotifItem = ({motif, onChange}: Props): React.JSX.Element => {

    return (
        <div className="motif">
            <div className="pad-y">{motif.titel}</div>
            <div className="pad-y">{motif.description}</div>
            <div className="flex_list flex_gap position_top_right">
                <MotifDialog motif={motif} onChange={onChange} openElement={<button><TfiPencil /></button>} />
                <button onClick={() => onChange(motif, CRUDKind.Delete)}><TfiTrash /></button>
            </div>
        </div>
    );
}

