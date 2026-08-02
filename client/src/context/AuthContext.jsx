import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const refreshSession = async () => {

        try {

            const { data } = await api.get("/auth/session");

            if (data.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }

        } catch (error) {

            console.log("Session check failed:", error);
            setUser(null);

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        refreshSession();
    }, []);



    // Login
    const login = async (email, password, role_type) => {

        const { data } = await api.post("/auth/login", {
            email,
            password,
            role_type
        });


        if (data.token) {
            localStorage.setItem("token", data.token);
        }


        if (data.user) {
            setUser(data.user);
        }


        return data.user;
    };



    const logout = () => {

        localStorage.removeItem("token");
        setUser(null);

    };



    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}



export function useAuth() {

    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }

    return ctx;
}