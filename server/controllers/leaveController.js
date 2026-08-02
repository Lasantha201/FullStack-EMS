import { inngest } from "../inngest/index.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";


// Create Leave
// POST /api/leaves

export const createLeave = async (req, res) => {

    try {

        const user = req.user;

        const employee = await Employee.findOne({
            userId: user.userId
        });


        if (!employee) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }


        if (employee.isDeleted) {
            return res.status(403).json({
                error: "Your account is deactivated. You cannot apply for leave"
            });
        }


        const { type, startDate, endDate, reason } = req.body;


        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({
                error: "Missing Fields"
            });
        }


        const start = new Date(startDate);
        const end = new Date(endDate);


        const today = new Date();
        today.setHours(0, 0, 0, 0);


        if (start < today || end < today) {

            return res.status(400).json({
                error: "Leave date must be in the future"
            });

        }


        if (end < start) {

            return res.status(400).json({
                error: "End date cannot be before start date"
            });

        }


        const leave = await LeaveApplication.create({

            employeeId: employee._id,

            type,

            startDate: start,

            endDate: end,

            reason,

            status: "PENDING"

        });



        await inngest.send({

            name: "leave/pending",

            data: {
                LeaveApplicationId: leave._id
            }

        });


        return res.json({

            success: true,

            data: leave

        });



    } catch (error) {

        console.log(error);

        return res.status(500).json({

            error: "Failed to create leave"

        });

    }

};




// Get Leave
// GET /api/leaves

export const getLeaves = async (req, res) => {

    try {

        const user = req.user;

        const isAdmin = user.role === "ADMIN";


        if (isAdmin) {


            const status = req.query.status;


            const where = status ? { status } : {};


            const leaves = await LeaveApplication
                .find(where)
                .populate("employeeId")
                .sort({ createdAt: -1 });



            const data = leaves.map((leave) => {

                const obj = leave.toObject();


                return {

                    ...obj,

                    id: obj._id.toString(),

                    employee: obj.employeeId,

                    employeeId: obj.employeeId?._id?.toString()

                };

            });


            return res.json({

                data

            });



        } else {


            const employee = await Employee.findOne({

                userId: user.userId

            }).lean();



            if (!employee) {

                return res.status(404).json({

                    error: "Employee not found"

                });

            }



            const leaves = await LeaveApplication.find({

                employeeId: employee._id

            })
            .sort({
                createdAt: -1
            });



            return res.json({

                data: leaves,

                employee: {

                    ...employee,

                    id: employee._id.toString()

                }

            });

        }



    } catch (error) {

        console.log(error);

        return res.status(500).json({

            error: "Failed to get leaves"

        });

    }

};




// Update Leave Status
// PATCH /api/leaves/:id

export const updateLeaveStatus = async (req, res) => {


    try {


        const { status } = req.body;



        if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {

            return res.status(400).json({

                error: "Invalid status"

            });

        }



        const leave = await LeaveApplication.findByIdAndUpdate(

            req.params.id,

            { status },

            { new: true }

        );



        if (!leave) {

            return res.status(404).json({

                error: "Leave not found"

            });

        }



        return res.json({

            success: true,

            data: leave

        });



    } catch (error) {


        console.log(error);


        return res.status(500).json({

            error: "Failed to update leave"

        });

    }

};