import React, { useImperativeHandle, useRef } from "react";


interface Props {
    className?: string;
    openElement: JSX.Element;
    closeElement?: JSX.Element;
    children: React.ReactNode;
    ref: React.RefObject<HTMLDialogElement>;
}

export const Dialog = React.forwardRef(({className = "", openElement, closeElement = <div className="position_top_right">X</div>, children}: Props, ref: React.ForwardedRef<HTMLDialogElement>): JSX.Element => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => dialogRef.current!, []);

    const open  = React.cloneElement(openElement,  {onClick: () => dialogRef.current!.showModal()});
    const close = React.cloneElement(closeElement, {onClick: () => dialogRef.current!.close()});

    return (
        <>
            {open}
            <dialog className={className} ref={dialogRef}>
                {close}
                {children}
            </dialog>
        </>
    )
})

export default Dialog;

