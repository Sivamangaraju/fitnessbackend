const express =require('express')

const router =express.Router()

const {homepage,getAllUsers,register,login,deleteUsers}=require('../controllers/tasks');
const {otpVerification,sendOTP}=require('../controllers/otpContoller')

const {addWorkout} =require('../controllers/addWorkout')

const authMiddleware=require('../middlewares/auth')
//get API
router.route('/').get(homepage);
router.route('/getAllUsers').get(getAllUsers);

//post API
router.route('/login').post(login);
router.route('/register').post(register);

router.route('/forgetpassword').post(sendOTP)
router.route('/verifyOtp').post(otpVerification);

//router.route('/dashboard').post(authMiddleware,getDashboard)



//router.route('/addWorkout').post(addWorkout);

//put API's



//Delete Operation

router.route('/deleteUsers').delete(authMiddleware, deleteUsers);

module.exports=router
