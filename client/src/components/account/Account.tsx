import SignUp from "./SignUp"
import Login from "./Login"
import Logout from "./Logout"
import Delete from "./Delete"
import useAuth from "../../hooks/useAuth"

export default function Account() {
    const [loggedin] = useAuth()

    return (
        <div>
            <h2>Account</h2>
            {loggedin ? (
                <>
                    <Logout />
                    <Delete />
                </>
            ) : (
                <>
                    <SignUp />
                    <Login />
                </>
            )}
        </div>
    )
}
