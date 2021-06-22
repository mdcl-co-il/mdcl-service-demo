import UserBox from "./UserBox";

export default function TopBar() {
    return (
        <>
            <div className="row background-1 top-bar">
                <div className="col-4">
                    <input className="form-control" type="text" placeholder="Search for something"
                           aria-label="Search for something"/>

                </div>
                <div className="col-8">
                    <UserBox/>
                </div>
            </div>
        </>
    );
}