import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import Loading from "../../../components/ui/Loading";

const ProtectedRoute = ({ children }) => {
    const { user, setshowUserLogin, isAuthLoading } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !isAuthLoading) {
            setshowUserLogin(true);
            navigate("/");
        }
    }, [user, navigate, setshowUserLogin, isAuthLoading]);

    if (isAuthLoading) {
        return <Loading />;
    }

    if (!user) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
