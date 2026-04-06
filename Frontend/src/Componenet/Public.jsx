import { useAuth } from "../feature/auth/hook/useAuth";
import { Navigate } from "react-router";

const Public = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <h1>loading</h1>;
    }

    if (user) {
        return <Navigate to="/" />;
    }

    return children;
};

export default Public;