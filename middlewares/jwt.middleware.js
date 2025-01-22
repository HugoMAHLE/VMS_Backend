import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {

  let token = req.headers.authorization

  if(!token){
    return res.status(401).json({ error: "Token not provided"})
  }

  token = token.split(" ")[1]

  try {
    const {userid} = jwt.verify(token, process.env.JWT_SECRET)
    req.userid = userid
    next()
  } catch (error) {
    return res.status(400).json({error: "Invalid Token"})
  }
}
