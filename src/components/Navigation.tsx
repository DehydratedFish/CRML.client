import { ReactNode } from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";


const NavbarLink = ({to, children, className, ...props}: {to:string, children: ReactNode, className: string}) => {
    const resolvedPath = useResolvedPath(to);
    const isActive     = useMatch({path: resolvedPath.pathname, end:true});

    return (
        <li className={className + (isActive ? " active" : "")}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    )
}

export const Navigation = (): JSX.Element => {
    return (
        <ul className="navbar">
            <NavbarLink className="pad" to="/">Overview</NavbarLink>
            <NavbarLink className="pad" to="/customer">Kunden</NavbarLink>
        </ul>
    )
}

export default Navigation;

