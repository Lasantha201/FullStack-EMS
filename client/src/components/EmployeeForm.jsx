import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";


const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const isEditMode = Boolean(initialData);



    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);


        try {

            const formData = new FormData(e.currentTarget);


            if(isEditMode){

                const password = formData.get("password");

                if(!password){
                    formData.delete("password");
                }

            }


            const employeeData = Object.fromEntries(
                formData.entries()
            );


            const url = isEditMode
                ? `/employees/${initialData.id}`
                : "/employees";


            const method = isEditMode
                ? "put"
                : "post";


            await api[method](url, employeeData);



            toast.success(
                isEditMode
                ? "Employee updated successfully"
                : "Employee created successfully"
            );



            if(onSuccess){

                onSuccess();

            }else{

                navigate("/employees");

            }



        } catch(error){


            console.error(
                "Employee save error:",
                error.response?.data || error.message
            );


            toast.error(
                error.response?.data?.error ||
                "Failed to save employee"
            );


        } finally {

            setLoading(false);

        }

    };





    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-3xl animate-fade-in"
        >


            {/* Personal Information */}

            <div className="card p-5 sm:p-6">


                <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
                    Personal Information
                </h3>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">


                    <div>

                        <label className="block mb-2">
                            First Name
                        </label>

                        <input
                            name="firstName"
                            required
                            defaultValue={initialData?.firstName || ""}
                        />

                    </div>



                    <div>

                        <label className="block mb-2">
                            Last Name
                        </label>

                        <input
                            name="lastName"
                            required
                            defaultValue={initialData?.lastName || ""}
                        />

                    </div>



                    <div>

                        <label className="block mb-2">
                            Phone Number
                        </label>

                        <input
                            name="phone"
                            required
                            defaultValue={initialData?.phone || ""}
                        />

                    </div>



                    <div>

                        <label className="block mb-2">
                            Join Date
                        </label>

                        <input
                            type="date"
                            name="joinDate"
                            required
                            defaultValue={
                                initialData?.joinDate
                                ? new Date(initialData.joinDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                        />

                    </div>



                    <div className="sm:col-span-2">

                        <label className="block mb-2">
                            Bio
                        </label>


                        <textarea
                            name="bio"
                            rows="3"
                            defaultValue={initialData?.bio || ""}
                            placeholder="Brief description..."
                        />

                    </div>


                </div>


            </div>





            {/* Employment Details */}


            <div className="card p-5 sm:p-6">


                <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
                    Employment Details
                </h3>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">


                    <div>

                        <label className="block mb-2">
                            Department
                        </label>


                        <select
                            name="department"
                            defaultValue={
                                initialData?.department || ""
                            }
                        >

                            <option value="">
                                Select Department
                            </option>


                            {
                                DEPARTMENTS.map((dept)=>(
                                    <option
                                        key={dept}
                                        value={dept}
                                    >
                                        {dept}
                                    </option>
                                ))
                            }


                        </select>


                    </div>




                    <div>

                        <label className="block mb-2">
                            Position
                        </label>

                        <input
                            name="position"
                            required
                            defaultValue={
                                initialData?.position || ""
                            }
                        />

                    </div>




                    <div>

                        <label className="block mb-2">
                            Basic Salary
                        </label>

                        <input
                            type="number"
                            name="basicSalary"
                            min="0"
                            required
                            defaultValue={
                                initialData?.basicSalary || 0
                            }
                        />

                    </div>




                    <div>

                        <label className="block mb-2">
                            Allowances
                        </label>

                        <input
                            type="number"
                            name="allowances"
                            min="0"
                            defaultValue={
                                initialData?.allowances || 0
                            }
                        />

                    </div>




                    <div>

                        <label className="block mb-2">
                            Deductions
                        </label>

                        <input
                            type="number"
                            name="deductions"
                            min="0"
                            defaultValue={
                                initialData?.deductions || 0
                            }
                        />

                    </div>




                    {
                        isEditMode && (

                        <div>

                            <label className="block mb-2">
                                Status
                            </label>


                            <select
                                name="employmentStatus"
                                defaultValue={
                                    initialData?.employmentStatus || "ACTIVE"
                                }
                            >

                                <option value="ACTIVE">
                                    Active
                                </option>

                                <option value="INACTIVE">
                                    Inactive
                                </option>


                            </select>

                        </div>

                        )
                    }


                </div>


            </div>






            {/* Account Setup */}


            <div className="card p-5 sm:p-6">


                <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
                    Account Setup
                </h3>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">


                    <div className="sm:col-span-2">

                        <label className="block mb-2">
                            Work Email
                        </label>


                        <input
                            type="email"
                            name="email"
                            required
                            defaultValue={
                                initialData?.email || ""
                            }
                        />


                    </div>



                    {
                        !isEditMode && (

                        <div>

                            <label className="block mb-2">
                                Temporary Password
                            </label>


                            <input
                                type="password"
                                name="password"
                                required
                            />

                        </div>

                        )
                    }



                    {
                        isEditMode && (

                        <div>

                            <label className="block mb-2">
                                Role
                            </label>


                            <select
                                name="role"
                                defaultValue={
                                    initialData?.user?.role || "EMPLOYEE"
                                }
                            >

                                <option value="EMPLOYEE">
                                    Employee
                                </option>


                                <option value="ADMIN">
                                    Admin
                                </option>


                            </select>


                        </div>

                        )
                    }



                </div>


            </div>






            {/* Buttons */}


            <div className="flex justify-end gap-3">


                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                        onCancel
                        ? onCancel()
                        : navigate(-1)
                    }
                >

                    Cancel

                </button>



                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center justify-center"
                >

                    {
                        loading &&
                        <Loader2Icon
                            className="w-4 h-4 mr-2 animate-spin"
                        />
                    }


                    {
                        isEditMode
                        ? "Update Employee"
                        : "Create Employee"
                    }


                </button>


            </div>



        </form>

    );

};


export default EmployeeForm;    