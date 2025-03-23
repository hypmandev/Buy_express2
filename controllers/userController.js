const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verify, reset } = require('../utils/mailTemplate');
const { send_mail } = require('../middleware/nodemailer');
const { validate } = require('../utils/utilities');
const { registerUserSchema, loginSchema, forgotPasswordSchema, registerAdminSchema } = require('../validation/userValidation');

exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const existingEmail = await userModel.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        message: `Admin with email: ${email} already exist`
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
      roles: 'admin'
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
    const link = `https://shopey-ten.vercel.app/emailverification/token/${token}`;
    const firstName = user.fullName.split(' ')[0];

    const mailOptions = {
      email: user.email,
      subject: 'Account Verification',
      html: verify(link, firstName)
    };

    await send_mail(mailOptions);
    await user.save();
    res.status(201).json({
      message: 'Account registered successfully',
      data: user
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error registering user',
      data: error.message
    })
  }
};

exports.registerUser = async (req, res) => {
  try {
    // const validatedData = await validate(req.body, registerUserSchema)
    const { fullName, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const existingEmail = await userModel.find({ email: email.toLowerCase() });

    if (existingEmail.length === 1) {
      return res.status(400).json({
        message: `user with email: ${email} already exist`
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15mins' });
    const link = `https://shopey-ten.vercel.app/emailverification/${token}`;
    const firstName = user.fullName.split(' ')[0];

    const mailOptions = {
      email: user.email,
      subject: 'Account Verification',
      html: verify(link, firstName)
    };

    await send_mail(mailOptions);
    await user.save();
    res.status(201).json({
      message: 'Account registered successfully',
      data: user
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    })
  }
};

exports.loginUser = async (req, res) => {
  try {

    const validatedData = await validate(req.body, loginSchema)
    const { email, password, userName } = validatedData

    if (!email && !userName) {
      return res.status(400).json({
        message: 'Please enter your email address'
      })
    };

    if (!password) {
      return res.status(400).json({
        message: 'Please your password'
      })
    };
    let user;
    if (email) {
      user = await userModel.findOne({ email: email.toLowerCase() })
    }

    if (userName) {
      user = await userModel.findOne({ userName: userName.toLowerCase() })
    };
    if (!user) {
      return res.status(400).json({
        message: 'Account not found'
      })
    };

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(400).json({
        message: 'Incorrect password'
      })
    };

    if (user.IsVerified === false) {
      return res.status(400).json({
        message: 'Account is not verified, link has been sent to email address'
      })
    }

    const token = jwt.sign({ userId: user._id, email: user.email, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1day' });

    res.status(200).json({
      message: 'Account login successfull',
      user: user,
      token
    })
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired. Please login again'
      })
    }
    res.status(500).json({
      message: 'Error Logging user In',
      error: error
    })
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };
    // console.log(token)

    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { userId } = jwt.decode(token);
          const user = await userModel.findById(userId);

          if (!user) {
            return res.status(404).json({
              message: 'Account not found'
            })
          };

          if (user.IsVerified === true) {
            return res.status(400).json({
              message: 'Account is verified already'
            })
          };

          const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
          const link = `https://shopey-ten.vercel.app/emailverification/${newToken}`;
          const firstName = user.fullName.split(' ')[0];

          const mailOptions = {
            email: user.email,
            subject: 'Resend: Account Verification',
            html: verify(link, firstName)
          };

          await send_mail(mailOptions);
          res.status(200).json({
            message: 'Session expired: Link has been sent to email address'
          })
        }
      } else {
        const user = await userModel.findById(payload.userId);

        if (!user) {
          return res.status(404).json({
            message: 'Account not found'
          })
        };

        if (user.IsVerified === true) {
          return res.status(400).json({
            message: 'Account is verified already'
          })
        };

        user.IsVerified = true;
        await user.save();

        res.status(200).json({
          message: 'Account verified successfully'
        })
      }
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired: link has been sent to email address'
      })
    }
    res.status(500).json({
      message: 'Error Verifying user'
    })
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await userModel.findOne({ email: email.toLowerCase() });
    console.log(email.toLowerCase())

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1hour' });
    const link = `https://shopey-ten.vercel.app/resetpassword/token/${token}`; 
    // const link = `${req.protocol}://${req.get("host")}/forgot_password/user/${token}`
    const firstName = user.fullName.split(' ')[0];

    const mailOptions = {
      email: user.email,
      subject: 'Reset Password',
      html: reset(link, firstName)
    };

    await send_mail(mailOptions);
    return res.status(200).json({
      message: 'Link has been sent to email address'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Forgot password failed',
      error: error.message
    })
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired. Please enter your email to resend link',
        data: error.message
      })
    };
    res.status(500).json({
      message: 'Error resetting password'
    })
  }
};   