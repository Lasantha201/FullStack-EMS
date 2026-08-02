import { inngest } from "../inngest/index.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

// Clock In / Clock Out
// POST /api/attendance

export const clockInOut = async (req, res) => {
  try {

    const user = req.user;

    const employee = await Employee.findOne({
      userId: user.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot clock in or out.",
      });
    }


    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });


    const now = new Date();


    if (!existingAttendance) {

      const isLate =
        now.getHours() > 9 ||
        (now.getHours() === 9 && now.getMinutes() > 0);


      const attendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "PRESENT" : "PRESENT",
      });


      await inngest.send({
        name: "employee/check-out",
        data: {
          employeeId: employee._id.toString(),
          attendanceId: attendance._id.toString(),
        },
      });


      return res.json({
        success: true,
        type: "CHECK_IN",
        data: attendance,
      });
    }



    if (!existingAttendance.checkOut) {

      const checkInTime = new Date(existingAttendance.checkIn).getTime();

      const diffMs = now.getTime() - checkInTime;
      const diffHours = diffMs / (1000 * 60 * 60);


      existingAttendance.checkOut = now;


      const workingHours = Number(diffHours.toFixed(2));


      let dayType = "Short Day";


      if (workingHours >= 8) {
        dayType = "Full Day";
      } else if (workingHours >= 6) {
        dayType = "Three Quarter Day";
      } else if (workingHours >= 4) {
        dayType = "Half Day";
      }


      existingAttendance.workingHours = workingHours;
      existingAttendance.dayType = dayType;


      await existingAttendance.save();


      return res.json({
        success: true,
        type: "CHECK_OUT",
        data: existingAttendance,
      });
    }


    return res.json({
      success: true,
      type: "CHECK_OUT",
      data: existingAttendance,
    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Operation failed",
    });

  }
};



// GET ATTENDANCE
// GET /api/attendance

export const getAttendance = async (req, res) => {

  try {

    const user = req.user;


    const employee = await Employee.findOne({
      userId: user.userId,
    });


    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }


    const limit = parseInt(req.query.limit || 30);


    const history = await Attendance.find({
      employeeId: employee._id,
    })
      .sort({ date: -1 })
      .limit(limit);



    return res.json({
      data: history,
      employee: {
        isDeleted: employee.isDeleted,
      },
    });


  } catch (error) {

    console.error(error);


    return res.status(500).json({
      error: "Failed to fetch attendance",
    });

  }

};