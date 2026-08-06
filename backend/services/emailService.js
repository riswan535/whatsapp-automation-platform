//----------------------------------------------------------------------------IMPORTS-------------------------------------------------------------------------------------------------

const nodemailer = require("nodemailer");

//---------------------------------------------------------------------------TRANSPORTER------------------------------------------------------------------------------------------------------

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS

    }

});

//--------------------------------------------------------------------------EMAIL TO ADMIN------------------------------------------------------------------------------------------------------

const sendAdminMail = async (name, email) => {

    try {

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: "NEW USER REGISTRATION",

            html: `

                <h2>New User Registration Request</h2>

                <hr>

                <p><strong>Name :</strong> ${name}</p>

                <p><strong>Email :</strong> ${email}</p>

                <br>

                <p>Please review and approve this user.</p>

            `

        });

    } catch (error) {

        console.log("Admin Email Error :", error.message);

    }

};

//---------------------------------------------------------------------------EMAIL TO USER---------------------------------------------------------------------------------------------------

const userApprovalEmail = async (name, email) => {

    console.log("Sending approval email...");
    console.log("Name:", name);
    console.log("Email:", email);

    try {

        const info = await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "ACCOUNT APPROVED",

            html: `

                <h2>Hi ${name},</h2>

                <p>Your account has been approved by the Admin.</p>

                <p>You can now log in to your account.</p>

                <br>

                <p>Thank you.</p>

            `

        });

           console.log("Mail sent successfully!");
           console.log(info);

    } catch (error) {

        console.log("User Approval Email Error :", error.message);
        console.log("User Approval Email Error");
        console.log(error);


    }

};

//------------------------------------------------------------------EXPORTS----------------------------------------------------------------------------------

module.exports = {

    sendAdminMail,
    userApprovalEmail

};