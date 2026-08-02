import jwt from "jsonwebtoken";


export const protect = (req, res, next)=> {

    try {

        const authHeader = req.headers.authorization;


        if(!authHeader || !authHeader.startsWith("Bearer ")){

            return res.status(401).json({
                error: "Unauthorized"
            });

        }


        const token = authHeader.split(" ")[1];


        const user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        if(!user){

            return res.status(401).json({
                error: "Unauthorized"
            });

        }


        req.user = user;

        next();


    } catch(error) {

        console.error("Auth error:", error.message);

        return res.status(401).json({
            error: "Unauthorized"
        });

    }

};



export const protectAdmin = (req, res, next)=>{


    if(req.user?.role !== "ADMIN"){

        return res.status(403).json({
            error: "Admin access required"
        });

    }


    next();

};