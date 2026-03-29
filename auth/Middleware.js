import jwt from "jsonwebtoken";

const auth = (requiredRole = null) => {
  return async (req, res, next) => {
  let token = req.headers['authorization'];
  if(!token){
    return res.status(401).json({message:"Unauthorized"});
  }
  token = token.split(" ")[1];
  jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err){
      return res.status(400).json({message:"Invalid Token"});
    }else{
      // console.log(decoded)
      req.user = decoded;
      if(requiredRole && req.user.role !== requiredRole){
        return res.status(403).json({message:"Unauthorized"});
      }
      next();
    }

  })
}
}


 

export default auth;