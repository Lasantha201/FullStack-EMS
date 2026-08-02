import Employee from "../models/Employee.js";


// Get profile
// GET /api/profile

export const getProfile = async (req, res) => {
    try {

        const user = req.user;

        const employee = await Employee.findOne({
            userId: user.userId
        });


        if (!employee) {
            // Authenticated user is admin
            return res.json({
                firstName: "Admin",
                lastName: "",
                email: user.email,
                role: user.role
            });
        }


        if (employee.isDeleted) {
            return res.status(403).json({
                error: "Your account is deleted. Please contact the administrator."
            });
        }


        return res.json({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            bio: employee.bio || "",
            image: employee.image || "",
            role: employee.role
        });


    } catch (error) {

        console.error("Get Profile Error:", error);

        return res.status(500).json({
            error: "Failed to fetch profile"
        });
    }
};



// Update profile
// PUT /api/profile

export const updateProfile = async (req, res) => {

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
                error: "Your account is deleted. Please contact the administrator."
            });

        }



        const updatedEmployee = await Employee.findByIdAndUpdate(
            employee._id,
            {
                bio: req.body.bio
            },
            {
                new: true
            }
        );


        return res.json({
            success: true,
            profile: updatedEmployee
        });


    } catch(error) {

        console.error("Update Profile Error:", error);

        return res.status(500).json({
            error: "Failed to update profile"
        });

    }
};