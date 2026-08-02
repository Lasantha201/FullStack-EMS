import { useCallback, useEffect, useState } from "react"
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets";
import Loading from "../components/Loading";
import PaySlipList from "../components/payslip/PaySlipList";
import GeneratePaySlipForm from "../components/payslip/GeneratePaySlipForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const PaySlips = () => {

  const [paySlips, setPaySlips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth()
  const isAdmin = user?.role === "ADMIN";

  const fetchPaySlips = useCallback(async ()=>{
    try {
      const res = await api.get('/payslips');
      setPaySlips(res.data.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    fetchPaySlips()
  }, [fetchPaySlips])

  useEffect(()=>{
    if(isAdmin) api.get("/employees").then((res)=> setEmployees(res.data.
      filter((e)=> !e.isDeleted )
    )).catch(()=>{})
  }, [isAdmin])

  if(loading) return <Loading />

  return (
  <div className="animate-fade-in">
    <div className="flex flex-col sm:flex-row justify-between items-start
      sm:items-center gap-4 mb-8">
      <div>
        <h1 className="page-title">PaySlips</h1>
        <p className="page-subtitle">
          {isAdmin
            ? "Generate and manage employee paySlips"
            : "Your payslip history"}
        </p>
      </div>

      {isAdmin && <GeneratePaySlipForm employees={employees} onSuccess={fetchPaySlips}/>}
    </div>

    <PaySlipList paySlips={paySlips} isAdmin={isAdmin}/>
  </div>
);
}

export default PaySlips