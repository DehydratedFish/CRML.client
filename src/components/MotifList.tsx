import { FadeLoader } from "react-spinners";
import useSWR from "swr";
import { toast } from "react-toastify";

import Motif, { axiosDeleteMotif, axiosGetMotifs, axiosPutMotif, axiosPostMotif, axiosPostMotifFiles } from "../models/Motif";
import MotifDialog from "./MotifDialog";
import { MotifItem } from "./MotifItem";
import { CRUDKind } from "../helper";


const addAttachments = async (motif: Motif, attachments: File[]) => {
    const formData = new FormData();
    for (const file of attachments) {
        if (motif.attachments.indexOf(file.name) === -1) {
            motif.attachments.push(file.name);
        }

        formData.append(file.name, file);
    }

    await axiosPostMotifFiles(["/api/motif/attachment", motif.id, formData])
    .catch(() => {
        toast("Motiv Dateien konnten nicht hochgeladen werden.");
    });
}

interface Props {
    customerId: number;
}

export const MotifList = ({customerId}: Props): JSX.Element => {
    const {data: motifs, error, isLoading, mutate} = useSWR(["/api/motif", customerId], axiosGetMotifs);

    if (isLoading || !motifs) return <FadeLoader />;
    if (error) return <div>Keine Motive geladen.</div>

    const updateMotif = async (m: Motif, kind: CRUDKind = CRUDKind.Update, index?: number, attachments?: File[]) => {
        if (kind === CRUDKind.Update && index != undefined) {
            await axiosPutMotif(["/api/motif", m])
            .then(async () => {
                if (attachments != undefined) {
                    addAttachments(m, attachments);
                }

                mutate((prev) => {
                    if (prev) {
                        prev.splice(index, 1, m);

                        return prev;
                    }
                })
            }).catch(() => {
                toast("Motiv konnte nicht geändert werden.");
            });
        } else if (kind === CRUDKind.Create) {
            await axiosPostMotif(["/api/motif", m])
            .then(async (response: Motif) => {
                m.id = response.id;

                if (attachments != undefined) {
                    await addAttachments(m, attachments);
                }

                mutate((prev) => {
                    if (prev) {
                        prev.push(m);

                        return prev;
                    }
                })
            }).catch(() => {
                toast("Motiv konnte nicht hinzugefügt werden.");
            });
        } else if (kind === CRUDKind.Delete && index != undefined) {
            await axiosDeleteMotif(["/api/motif", motifs[index].id])
            .then(() => {
                mutate((prev) => {
                    if (prev) {
                        prev.splice(index, 1);

                        return prev;
                    }
                })
            }).catch(() => {
                toast("Motiv konnte nicht gelöscht werden.")
            });
        }
    }

    const drawList = motifs.map((m: Motif, index: number) => {
        return <MotifItem key={m.id} onChange={(m: Motif, kind?: CRUDKind, attachments?: File[]) => updateMotif(m, kind, index, attachments)} motif={m} />
    });

    return (
        <div className="motif_list">
            <MotifDialog motif={{customerId: customerId, attachments: new Array<string>()} as Motif} onChange={(m: Motif, _?: CRUDKind, attachments?: File[]) => updateMotif(m, CRUDKind.Create, undefined, attachments)} openElement={<button className="margin pad-x">+</button>} />
            {drawList}
        </div>
    )
}

export default MotifList;

