import { ReactNode, useState } from "react";
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";


interface Props {
    title: string;
    className?: string;
    children: ReactNode;
}

export const Expandable = ({title, className = "", children}: Props): JSX.Element => {
    const [expanded, setExpanded] = useState<boolean>(false);

    if (!expanded) return <div className={className} onClick={() => setExpanded(true)}>{title}<TfiAngleRight className="align_right" /></div>;

    return (
        <>
            <div className={className} onClick={() => setExpanded(false)}>{title}<TfiAngleDown className="align_right" /></div>
            {children}
        </>
    )
}

export default Expandable;

