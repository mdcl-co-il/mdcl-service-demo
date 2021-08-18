import {Link} from "react-router-dom";

export default function LeftMenu() {

    return (
        <>
            <h1>NGN42</h1>
            <ul>
                <li>
                    <Link to="/entitiesHome">Entities</Link>
                </li>
                <li>
                    <Link to="/entityReports">Entity reports</Link>
                </li>
                <li>
                    <Link to="/smartReport/Wizards">Smart Reports Wizards</Link>
                </li>
            </ul>
        </>
    );
}