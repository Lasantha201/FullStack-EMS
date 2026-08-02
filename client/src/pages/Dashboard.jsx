import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/AdminDashboard";
import api from "../api/axios";
import toast from "react-hot-toast";


const Dashboard = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const { data } = await api.get("/dashboard");

        setData(data);

      } catch (error) {

        console.error("Dashboard loading error:", error);

        toast.error(
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, []);



  if (loading) {
    return <Loading />;
  }



  if (!data) {
    return (
      <p className="text-center text-slate-500 py-12">
        Failed to load dashboard.
      </p>
    );
  }



  return data.role === "ADMIN"
    ? <AdminDashboard data={data} />
    : <EmployeeDashboard data={data} />;

};


export default Dashboard;