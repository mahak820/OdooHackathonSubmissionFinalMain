const expressAsyncHandler = require("express-async-handler")
const User = require("../../models/userSchema")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");


const registerUser = expressAsyncHandler(async(req,res) =>{
     const {name , email,password,role,city,phone} = req.body
    
    //  check that all the feild user gave or not 
    if(!name||!role||!email||!password||!phone||!city){
        res.status(400)
        throw new Error("fill all the details")
    }
    // then check user already exist or not 
    // left side email save in my mongoDB
    const emailExist = await User.findOne({email : email})
        const phoneExist = await User.findOne({phone : phone})

    if(emailExist||phoneExist) {
        res.status(400)
        throw new Error("user already exist")
    }

    //  hash password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password,salt)
    // create new user
    const user = await User.create({
        name,email,password : hashedPassword,role,city,phone
    })

    if(!user){
    res.status(400)
    throw new Error("user not created !")
    }
    res.status(201).json({name : user.name,
        email : user.email,
        role : user.role,
        city : user.city,
        phone : user.phone,
        id: user._id,
        isAdmin : user.isAdmin,
        isApproved : user.isApproved,
               token: generateToken(user._id)
    })

    

})
const loginUser = expressAsyncHandler( async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({name : user.name,
        email : user.email,
        role : user.role,
        city : user.city,
        phone : user.phone,
        id: user._id,
        isAdmin : user.isAdmin,
        isApproved : user.isApproved,
               token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
})

const generateToken = (id) => {
   return jwt.sign({id : id} , process.env.JWT_SECRET , {expiresIn : "30d"})
}

module.exports = {registerUser ,loginUser}