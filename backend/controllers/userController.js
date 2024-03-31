const User = require('../models/userModel');
const jwt = require('jsonwebtoken')


// Creating a JWT:
// const createToken = (_id) =>{
//    return jwt.sign({_id}, process.env.SECRET , {expiresIn:'3d'})
// }


// login user
const loginUser = async (req,res) =>{
    const {email, password} = req.body

    try{
        const user = await User.login(email,password)

        //Create a token
        //const token = createToken(user._id);

        res.status(200).json({user})
    } catch(error){
        res.status(400).json({error:error.message})

}
}


// signup user
const signupUser = async (req,res) =>{

    const { email, password} = req.body

    try{
        const user = await User.signup(email,password)

        //Create a token
        //const token = createToken(user._id);

        res.status(200).json({user})
    } catch(error){
        res.status(400).json({error:error.message})
    }
    
}





module.exports = {loginUser , signupUser}