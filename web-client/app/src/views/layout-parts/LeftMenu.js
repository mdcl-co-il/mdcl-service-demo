import {Link} from "react-router-dom";

export default function LeftMenu() {

    return (
        <>
            <h1>NGN42</h1>
            <ul>
                <li>
                    <Link to="/entitiesHome">Entities</Link>
                </li>
            </ul>
        </>
    );
}