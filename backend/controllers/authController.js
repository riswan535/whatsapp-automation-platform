//--------------------------------------------IMPORTING User--------------------------------------------------------------------------

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendAdminMail } = require("../services/emailService");

//----------------------------------------USER REGISTER CONTROL LOGIC--------------------------------------------------------------------

const registerUser = async (req, res) =>{

    try{

        const { name, email, password } = req.body;

        const exUser = await User.findOne({ email });

        if(exUser){

            return res.status(400).json({
                message: "Email Already Exists"
            });

        }else{

            const hashedPassword = await bcrypt.hash(password, 10);

            await User.create({
                
                name,
                email,
                password: hashedPassword
            });

            await sendAdminMail(

                name,
                email

            );

            res.status(201).json({
                message: "User registered successfully . Waiting for ADMIN approval"
            });

        }

    }catch(error){

        res.status(500).json({
            message: error.message
        });
    }
};

//----------------------------------------USER LOGIN CONTROL LOGIC-----------------------------------------------------------------------------------------------

const loginUser = async (req, res) =>{

    try{

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){

            return res.status(400).json({
                message: "invalid email"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){

            return res.status(400).json({
                message: "invalid password"
            });
        }

        if(!user.isApproved){

            return res.status(403).json({
                message: "waiting for admin approval"
            });
        }

        const token = jwt.sign({

            id: user._id,
            role: user.role
        },
        
        process.env.JWT_SECRET,

        {
            expiresIn: "7d"
        }
    );

    res.status(200).json({
            message: "login successful",
            token,
            role: user.role
        });

        

    }catch(error){

        res.status(500).json({
            message: error.message
        });
    }

};

//-----------------------------------------------------------EXPORTS---------------------------------------------------------------------------------------------------

module.exports = {registerUser, loginUser};
