const jwt = require("jsonwebtoken");

const SECRET =  process.env.JWT_SECRET;

function auth(req,res,next){
    try{
        const header = req.headers.authorization;

        if(!header){
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

        if(!token){
            return res.status(401).json({
                message: "Invalid token format"
            });
        }

        const decoded = jwt.verify(token, SECRET);

        req.user = decoded; //{id: ...}

        next();
    }catch(err){
        res.status(401).json({message:"Unauthorized"});
    }
}

module.exports = auth;