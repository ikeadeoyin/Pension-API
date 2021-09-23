const express = require("express");
const router = express.Router()

const employerController = require("../controllers/employer")
const employeeController = require("../controllers/employee")

// Employers Route

router.post("/employer", employerController.signUp)
router.post("/verifyEmail", employerController.VerifyEmail)
router.post("/verifyOtp", employerController.verifyOTP)
router.post("/employer/login", employerController.login)
// id is the same as accountNumber

router.get("/employers/:id", employerController.OneEmployer)
router.get("/employers", employerController.AllEmployers)


// Employees Route

router.post("/employee", employeeController.signUp)
router.post("/employee/verifyEmail", employeeController.VerifyEmail)
router.post("/employee/verifyOtp", employeeController.verifyOTP)
router.post("/employee/login", employeeController.login)
router.put("/employee/update", employeeController.update)

// id is the same as accountNumber
router.get("/employees/:id", employeeController.OneEmployee)
router.get("/employees", employeeController.AllEmployees)


module.exports = router