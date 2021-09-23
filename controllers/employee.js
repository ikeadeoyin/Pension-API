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
            firstName: req.body.firstName,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        }

        const Employee = await db.Employee.create(createData);
        const token = jwt.sign({ email: Employee.email }, process.env.SECRET, {
        expiresIn: '12h',
        });
      return res.status(201).json({ Employee: Employee, token });  
        
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

        const NewEmployeeOtpRecord = await db.EmployeeOtpModel.create({
            otp: OTP,
            email: req.body.email,
          });

        res.status(200).json({ message: `Otp as been sent to ${req.body.email}` });
  
        setTimeout(async () => {
          await NewEmployeeOtpRecord.destroy();
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
      const isValidEmailOtp = await db.EmployeeOtpModel.findOne({
        where: { otp: req.body.otp },
      });

      if (isValidEmailOtp) {
          const accountNumber = "EEM" + (Math.random((5) * 90000000000).valueOf().toString()).slice(2,14)

          let Employee = await db.Employee.findOne({
              where:{email: isValidEmailOtp.email}
          })
          Employee.accountNumber = accountNumber
          Employee = await Employee.save()
        return res.status(200).json({
          message: 'Verification successfully',
          email: isValidEmailOtp.email,
          accountNumber: Employee.accountNumber
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
     // Query for the unique employee
      const Employee = await db.Employee.findOne({
        where: { email: req.body.email },
      });
      
      // compare passwords
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        Employee.password,
      );
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid Login details' });
      }
      const token = jwt.sign({ email: Employee.email }, process.env.SECRET, {
        expiresIn: '12h',
      });
      return res.status(200).json({ Employee: Employee, token });
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Internal Server Error',
          err,
        });    
    }
}

const update = async(req,res)=>{
    try {

        // decode vendor email
      const tokenData = jwt.verify(
        req.headers.authorization.split(' ')[1],
        "ABC Pension",
      );

      let Employee = await db.Employee.findOne({
        where: { email: tokenData.email }
      })

        if(req.body.employerName) Employee.employerName = req.body.employerName
        if(req.body.employerId) Employee.employerId = req.body.employerId

        Employee = await Employee.save()
        return res.status(201).json({ Employee: Employee})


    } catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Internal Server Error',
          err,
        });   
        
    }

}

const OneEmployee = async (req, res)=>{
    try {
        let Employee = await db.Employee.findOne(
            {where:{accountNumber: req.params.accountNumber}
        })  

        return res.status(200).json({Employee: Employee})
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Internal Server Error',
            err,
          }); 
    }  
}

const AllEmployees = async(req, res)=>{
    try {
        let Employees = await db.Employee.findAll()
        return res.status(200).json({Employees: Employees})

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
    update,
    OneEmployee,
    AllEmployees
}