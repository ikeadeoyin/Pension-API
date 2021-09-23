const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {Auth} = require("two-step-auth")
const db = require("../models")


const signUp = async(req,res)=>{
    try {
        req.body.email = req.body.email.toLowerCase()

        req.body.password = await bcrypt.hash(
            req.body.password,
            bcrypt.genSaltSync(10),
        );

        createData = {
            name: req.body.name,
            email: req.body.email,
            officeAddress: req.body.address,
            password: req.body.password
        }

        const Employer = await db.Employer.create(createData);
        const token = jwt.sign({ email: Employer.email }, process.env.SECRET, {
        expiresIn: '12h',
        });
      return res.status(201).json({ Employer: Employer, token });  
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Internal Server Error',
          err,
        });
        
    }

}

const VerifyEmail = async (req, res)=>{
    try {
        const {OTP} = await Auth(req.body.email, "ABC Pensions");

        const NewEmployerOtpRecord = await db.EmployerOtpModel.create({
            otp: OTP,
            email: req.body.email,
          });

        res.status(200).json({ message: `Otp as been sent to ${req.body.email}` });
  
        setTimeout(async () => {
          await NewEmployerOtpRecord.destroy();
        }, 190000);
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Internal Server Error',
          err,
        });
        
    }
}

const verifyOTP = async(req, res)=>{
    try {
         // Get Otp record
      const isValidEmailOtp = await db.EmployerOtpModel.findOne({
        where: { otp: req.body.otp },
      });

      if (isValidEmailOtp) {
          const accountNumber = "EMP" + (Math.random((5) * 90000000000).valueOf().toString()).slice(2,14)

          let Employer = await db.Employer.findOne({
              where:{email: isValidEmailOtp.email}
          })
          Employer.accountNumber = accountNumber
          Employer = await Employer.save()
        return res.status(200).json({
          message: 'Verification successfully',
          email: isValidEmailOtp.email,
          accountNumber: Employer.accountNumber
        });
      }
      return res.status(400).json({ message: 'Otp seems to have expired' });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Internal Server Error',
          err,
        });
        
    }
}

const login =  async(req, res)=>{
    try {
     // Query for the unique employer
      const Employer = await db.Employer.findOne({
        where: { email: req.body.email },
      });
      
      // compare passwords
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        Employer.password,
      );
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid Login details' });
      }
      const token = jwt.sign({ email: Employer.email }, process.env.SECRET, {
        expiresIn: '12h',
      });
      return res.status(200).json({ Employer: Employer, token });
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Internal Server Error',
          err,
        });    
    }
}

const OneEmployer = async (req, res)=>{
    try {
        let Employer = await db.Employer.findOne(
            {where:{accountNumber: req.params.accountNumber}
        })  

        return res.status(200).json({Employer: Employer})
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error',
            err,
          }); 
    }  
}

const AllEmployers = async(req, res)=>{
    try {
        let Employers = await db.Employer.findAll()
        return res.status(200).json({Employers: Employers})

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error',
            err,
          }); 
        
    }
}

module.exports={
    signUp,
    VerifyEmail,
    verifyOTP,
    login,
    OneEmployer,
    AllEmployers
}