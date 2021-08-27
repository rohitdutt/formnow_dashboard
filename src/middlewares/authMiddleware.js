const axios = require("axios");

const authMiddleware = async (req , res , next) => {
    const headerToken = req.headers.authorization;
    if(!headerToken){
        return res.send({message: "No token provided"}).status(401);
    }
    if(headerToken && headerToken.split(" ")[0] !== "Bearer"){
        res.send({message: "Invalid token"}).status(401);
    }
    try {
        const result = await axios.post("https://formnow-auth.herokuapp.com/verify-token", {}, {
            headers: {
                'Authorization': headerToken
            }
        });
        if(result.data.message === "Could not authorize user" || result.status !== 200){
            throw result.data.message;
        }
        next();
    }catch (e) {
        res.status(400);
        res.send({message: "something went wrong , couldn't authorize user"});
    }
}

module.exports = authMiddleware;
