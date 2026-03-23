const { UserModel } = require("../models/users.model.js");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

// api/v1/users/register
const register = async(req, res) => {
  try{
    logger("Registration request received", "register", "Debug")
    const {userid, firstName, lastName, plant, email, pass} = req.body

    if(!userid || !firstName || !lastName || !plant || !email || !pass){
      logger("Missing Data: " + req.body , "register", "Debug")
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const user = await UserModel.findOneByEmail(email)
    if(user) {
      logger("User not created: already exists", "register", "Debug")
      return res.status(409).json({ ok: false, msg: "User already exists" })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashpass = await bcryptjs.hash(pass, salt)

    const newUser = await UserModel.createUser({
      userid, 
      firstName, 
      lastName, 
      plant, 
      email, 
      pass: hashpass, 
      utype:2
    })

    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn:  "1h" }
    )

    logger("User created", "register", "Debug")
    return res.status(201).json({ok:true, token: token})

  }catch (error) {
    logger( error, "register", "Error")
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor' + error
    })

  }
}

// api/v1/users/login
const login = async (req, res) => {
  try {

    const { userid, pass } = req.body;
    logger("Received login request: " + userid + " - " + pass, "login 1", "Debug" );
    if (!userid || !pass) {
      logger("Missing Data || User: " + userid + " pass: " + pass, "login 2", "Debug" );
      return res.status(400).json({ ok: false, msg: "Missing Data" });
    }

    const user = await UserModel.findOneById(userid);
    logger("user found: " + user , "login 3", "Debug" );
    if (!user) {
      logger("user not found", "login 4", "Debug" );
      return res.status(404).json({ ok: false, msg: "User does not exist" });
    }

    const isMatch = await bcryptjs.compare(pass, user.pass);
    console.log(isMatch)
    if (!isMatch) {
      logger("Incorrect password", "login 5", "Debug" );
      return res.status(401).json({ ok: false, msg: "Password is incorrect" });
    }

    let userType = user.type.trim();
    let userName = user.userid.trim();

    // defining expiration time for the token and routing depending on user type
    let expiresIn;
     switch (userType) {
      case "admin":
        expiresIn = "15m";
        break;
      case "user":
        expiresIn = "3d";
        break;
      case "general":
        expiresIn = "0";
        userType = userName;
        break;
      default:
        expiresIn = "1h";
    }

    logger("Creating token", "login 3", "Debug" ); // Log the token payload
    const token = jwt.sign(
      { userid: user.userid, type: user.type },
      process.env.JWT_SECRET,
      expiresIn === "0" ? undefined : { expiresIn }
    );

    return res.json({ ok: true, token: token, type: userType, userid: userid  });

  } catch (error) {
    logger(error, "login", "Error" );
    return res.status(500).json({
      ok: false,
      msg: "Server error",
    });
  }
};

// api/v1/users/profile
const getProfile = async(req, res) => {
  try{
    const user = await UserModel.findOneById(req.userid)
    return res.status(500).json({ ok: true, msg: user})
  }catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error server'
    })
  }
}

// api/v1/users/getemail
const getEmail = async(req, res) => {
  try{
    const user = await UserModel.getEmail(req.id)
    return res.status(500).json({ ok: true, msg: user})
  }catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error server'
    })
  }
}

// api/v1/users/getuid
const getUID = async (req, res) => {
  try {
    const id = req.query.id;  // Access the id from the query parameter
    console.log(id);  // You should now get the id passed in the query

    const user = await UserModel.getUID(id);  // Use the id to query the database
    return res.status(200).json({ ok: true, uid: user.uid });  // Send user data back in response
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error server'
    });
  }
};

// api/v1/users/get-host-name
const getHostName = async (req, res) => {
  try {
    const id = req.query.id;  // Access the id from the query parameter
    console.log(id);  // You should now get the id passed in the query

    const user = await UserModel.getHostName(id);  // Use the id to query the database
    console.log(user)
    return res.status(200).json({ user });  // Send user data back in response
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error server'
    });
  }
};

// api/v1/users/get-host-vists
const getHostVisits = async (req, res) => {
  try {
    const userid = req.query.userid;  
    logger('se recibio request', 'getHostVisits', 'Debug')  

    const hostVisits = await UserModel.getHostVisits(userid);
    console.log(hostVisits)
    return res.status(200).json( hostVisits );  
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error server'
    });
  }
};

// api/v1/users/restart-password
const restartPassword = async(req, res) => {
  try{
    logger("Password restart request received", "restartPassword", "Debug")
    const {email, pass} = req.body

    if(!email || !pass){
      logger("Missing Data: " + req.body , "restartPassword", "Debug")
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const user = await UserModel.findOneByEmail(email)
    if(!user) {
      logger("User not found for password restart", "restartPassword", "Debug")
      return res.status(404).json({ ok: false, msg: "User not found" })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashpass = await bcryptjs.hash(pass, salt)

    await UserModel.updatePassword(email, hashpass)

    logger("Password updated successfully", "restartPassword", "Debug")
    return res.status(200).json({ok:true, msg: "Password updated successfully"})

  }catch (error) {
    logger( error, "restartPassword", "Error")
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor' + error
    })

  }
}

const UserController = {
  register,
  login,
  getProfile,
  getEmail,
  getUID,
  getHostName,
  getHostVisits,
  restartPassword
}

module.exports = { UserController };
