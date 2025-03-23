const express = require('express')
const { registerUser, loginUser, verifyUser, forgotPassword, resetUserPassword, registerAdmin} = require('../controllers/userController')
const { authenticate, adminAuth} = require('../middleware/authentication');
const { registerUserValidator, loginValidator } = require('../middleware/validator');


const router = express.Router();


/**
 * @swagger
 * /api/v1/registerAdmin:
 *   post:
 *     summary: Registers a new admin on the platform
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the admin
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The admin's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: A secure password for the account
 *                 example: Password123!
 *               confirmPassword:
 *                 type: string
 *                 description: The confirmation of the password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account registered successfully
 *                 data:
 *                   type: object
 *                   description: The registered admin data
 *       400:
 *         description: Bad request (e.g., passwords do not match or email already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password does not match
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error registering user
 */
router.post("/admin/register", registerUserValidator, registerAdmin) 

router.post("/admin",adminAuth, registerAdmin)


/**
 * @swagger
 * /api/v1/registerUser:
 *   post:
 *     summary: Registers a new user on the platform
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the user
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: A secure password for the account
 *                 example: Password123!
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account registered successfully
 *                 data:
 *                   type: object
 *                   description: The registered user details
 *       400:
 *         description: Bad request (e.g., passwords do not match or email already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password does not match
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error registering user
 *                 error:
 *                   type: string
 *                   example: Internal server error details
 */
router.post('/register',registerUserValidator,registerUser);

/**
 * @swagger
 * /api/v1/loginUser:
 *   post:
 *     summary: Logs in a user to the platform
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The user's account password
 *                 example: Password123!
 *               userName:
 *                 type: string
 *                 description: The user's unique username (optional)
 *                 example: johndoe
 *     responses:
 *       200:
 *         description: Account login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account login successful
 *                 user:
 *                   type: object
 *                   description: The logged-in user's details
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsIn...
 *       400:
 *         description: Bad request (e.g., missing credentials, incorrect password, or unverified account)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error Logging user In
 *                 error:
 *                   type: string
 *                   example: Internal server error details
 */

router.post('/login',loginValidator, loginUser);

/**
 * @swagger
 * /api/v1/verifyUser/{token}:
 *   get:
 *     summary: Verifies a user's account using a token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token sent to the user's email
 *         example: eyJhbGciOiJIUzI1NiIsIn...
 *     responses:
 *       200:
 *         description: Account verified successfully or session expired with a new link sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account verified successfully
 *       400:
 *         description: Bad request (e.g., account already verified or session expired)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account is verified already
 *       404:
 *         description: Not found (e.g., token not found or account not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error Verifying user
 */

router.get('/verify/user/:token', verifyUser);

/**
 * @swagger
 * /api/v1/forgotPassword:
 *   post:
 *     summary: Initiates the password reset process for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user requesting the password reset
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully
 *       400:
 *         description: Bad request (e.g., invalid email or missing data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email address
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error processing password reset request
 */

router.post('/forgot_password/user', forgotPassword);

/**
 * @swagger
 * /api/v1/resetUserPassword/{token}:
 *   put:
 *     summary: Resets the password for a user using a verification token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token sent to the user's email
 *         example: eyJhbGciOiJIUzI1NiIsIn...
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The user's new password
 *                 example: NewPassword123!
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Bad request (e.g., mismatched passwords or session expired)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password does not match
 *                 data:
 *                   type: string
 *                   description: Additional error information
 *                   example: Session expired. Please enter your email to resend link
 *       404:
 *         description: Token or account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error resetting password
 */

router.post('/reset_password/user/:token', resetUserPassword);


module.exports = router;
