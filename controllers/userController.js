import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from 'bcrypt';
import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendWelcomeEmail = (user, verificationUrl, callback) => {
  const mailOptions = {
    from: "mahdichabbouh98@gmail.com",
    to: user.email,
    subject: "Welcome to Our App - Verify Your Email",
    text: `Hello ${user.firstName},\n\nThank you for signing up. Please verify your email by clicking on the following link: ${verificationUrl}\n\nBest regards,\nYour App Team`,
    html: `<p>Hello ${user.firstName},</p><p>Thank you for signing up. Please verify your email by clicking on the following link:</p><a href="${verificationUrl}">${verificationUrl}</a><p>Best regards,</p><p>Your App Team</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred while sending email:", error);
      return callback(error, null);
    }
    callback(null, info);
  });
};

export function verifyEmail(req, res) {
  const { token, email } = req.query;

  User.findOneAndUpdate(
    { email: email, verificationToken: token },
    { $set: { status: true, verificationToken: null } },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(400).send("Invalid token or email.");
      }
      res.send(`
        <html>
          <body>
            <h1>Your account is now active.</h1>
            <p>Thank you for verifying your email address. Your account has been activated.</p>
          </body>
        </html>
      `);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}


export async function signin(req, res, next) {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error("Database query error", err);
    return next(new Error("Error! Something went wrong."));
  }

  if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
    return next(new Error("Wrong details, please check your credentials."));
  }

  if (!existingUser.status) {
    return next(new Error("Sorry, your account is not active."));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.error("JWT sign error", err);
    return next(new Error("Error! Something went wrong."));
  }

  res.status(200).json({
    success: true,
    data: { userId: existingUser.id, email: existingUser.email, token },
  });
}


export function getoncebyName(req, res) {
  User.findOne({ firstName: req.params.firstName })
    .select('firstName lastName country birthDate email createdAt updatedAt -_id')
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export async function count(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: true });
    const inactiveUsers = await User.countDocuments({ status: false });

    res.status(200).json({
      totalUsers,
      activeUsers,
      inactiveUsers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export function getOncebyid(req, res) {
  User.findById(req.params._id)
    .select('firstName lastName country birthDate email createdAt updatedAt -_id')
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function getOncebyemail(req, res) {
  User.findOne({ email: req.params.email })
    .select('firstName lastName country birthDate email createdAt updatedAt -_id')
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function deleteOnce(req, res) {

  User.findById( {_id: req.params._id})
  .then((doc1) => {
    if (doc1.status !== true)    
    res.status(404).json({ msg : 'already deleted'
  })})
  .catch((err) => {
    res.status(500).json({ error: err });
  });
  User.findByIdAndUpdate({ _id: req.params._id },{status:false})
    .then((doc) => {
    
      res.status(200).json({
        msg: "user deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

/*

export function deleteOnce(req, res) {
  User.findById(req.params._id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ msg: "User not found" });
      }
      if (doc.status === false) {
        return res.status(400).json({ msg: "User already deleted" });
      }
      
      doc.status = false;
      return doc.save();
    })
    .then((updatedDoc) => {
      res.status(200).json({
        msg: "User deleted successfully",
        user: updatedDoc
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
*/

export function getAll(req, res) {
  User.find({})
    .then((u) => {
      let users = [];
      for (let i = 0; i < u.length; i++) {
        users.push({
          firstName: u[i].firstName,
          lastName: u[i].lastName,
          country: u[i].country,
          birthDate: u[i].birthDate,
          email: u[i].email,
        });
      }

      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
/////////////////////////////////////////////////////////////////////////////////////
/* export const sendResetPasswordEmail = (user, resetUrl, callback) => {
  const mailOptions = {
    from: "mahdichabbouh98@gmail.com",
    to: user.email,
    subject: "Reset Your Password",
    text: `Hello ${user.firstName},\n\nYou requested to reset your password. Please reset it by clicking on the following link: ${resetUrl}\n\nBest regards,\nYour App Team`,
    html: `<p>Hello ${user.firstName},</p><p>You requested to reset your password. Please reset it by clicking on the following link:</p><a href="${resetUrl}">${resetUrl}</a><p>Best regards,</p><p>Your App Team</p>`,
  };
  */
  export const sendResetPasswordEmail = (user, resetUrl, callback) => {
    const mailOptions = {
      from: "mahdichabbouh98@gmail.com",
      to: user.email,
      subject: "Reset Your Password",
      text: `Hello ${user.firstName},\n\nYou requested to reset your password. Please reset it by clicking on the following link: ${resetUrl}\n\nBest regards,\nYour App Team`,
      html: `<p>Hello ${user.firstName},</p><p>You requested to reset your password. Please reset it by clicking on the following link:</p><a href="${resetUrl}">${resetUrl}</a><p>Best regards,</p><p>Your App Team</p>`,
    };

  //////////////////////////////////////////////////////////////////
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred while sending email:", error);
      return callback(error, null);
    }
    callback(null, info);
  });
};

export function requestPasswordReset(req, res) {
  const { email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      user.save()
        .then((updatedUser) => {
          const resetUrl = `http://localhost:4201/auth/reset-password/${resetToken}`; // Update to your frontend URL
          sendResetPasswordEmail(updatedUser, resetUrl, (error, info) => {
            if (error) {
              console.error("Failed to send reset password email:", error);
              return res.status(500).json({ error: "Failed to send reset password email" });
            }
            res.status(200).json({ message: "Password reset email sent successfully" });
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}


export function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: "Password reset token is invalid or has expired" });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save()
          .then((updatedUser) => {
            res.status(200).json({ message: "Password has been reset successfully" });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}


export async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, country, birthDate, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      firstName,
      lastName,
      country,
      birthDate,
      email,
      password: hashedPassword,
      role: "client",
      verificationToken,
      status: false,
    });

    const verificationUrl = `http://127.0.0.1:9090/users/verify-email?token=${verificationToken}&email=${email}`;
    sendWelcomeEmail(newUser, verificationUrl, (error, info) => {
      if (error) {
        console.error("Failed to send welcome email:", error);
        // Ne renvoyez pas de réponse d'erreur ici car c'est une opération asynchrone
      }
      res.status(200).json({
        token: verificationToken,
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          country: newUser.country,
          birthDate: newUser.birthDate,
          email: newUser.email,
        },
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



export async function updateAllUsers(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, country, birthDate, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      country,
      birthDate,
      password: hashedPassword,
    };

    await User.updateMany({}, { $set: newUser }, { new: true });
    const updatedUsers = await User.find({}).select('firstName lastName country birthDate email');
    res.status(200).json({
      message: "All users updated successfully",
      users: updatedUsers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




export async function updateOnce(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, country, birthDate, password } = req.body;
  const { _id } = req.params;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = {
      firstName,
      lastName,
      country,
      birthDate,
      password: hashedPassword,
    };

    const user = await User.findByIdAndUpdate(_id, { $set: updatedUser }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        email: user.email,
        birthDate: user.birthDate,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




export async function signout(req, res, next) {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    next(err);
  }
}

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Si le jeton n'existe pas, renvoyer une erreur
    if (!token) {
      throw new Error(
        "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette route"
      );
    }

    // Vérifier le jeton et extraire l'ID de l'utilisateur
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Vérifier si l'utilisateur existe
    const currentUser = await usermodel.findById(decoded.userId);
    if (!currentUser) {
      throw new Error(
        "L'utilisateur auquel appartient ce jeton n'existe pas"
      );
    }

    // Vérifier si l'utilisateur a changé son mot de passe après la création du jeton
    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      // Mot de passe changé après la création du jeton (Erreur)
      if (passChangedTimestamp > decoded.iat) {
        throw new Error(
          "L'utilisateur a récemment changé son mot de passe. Veuillez vous reconnecter."
        );
      }
    }

    // Attacher les informations de l'utilisateur à l'objet req.user
    req.user = currentUser;
    next();
  } catch (error) {
    // Gérer les erreurs de vérification du jeton
    res.status(401).json({ error: error.message });
  }
};

// @desc    Rôles d'accès
export const allowedTo = (...roles) => async (req, res, next) => {
  try {
    if (!roles.includes(req.user.role)) {
      throw new Error("Vous n'êtes pas autorisé à accéder à cette route");
    }
    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

export const approvedaccount = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await usermodel.findById(decoded.userId);
    if (!user) {
      return res.status(400).send("Invalid token");
    }
    await usermodel.findByIdAndUpdate(user._id, { status: true });

    res.send("Email verified successfully");
  } catch (error) {
    res.status(500).send("Error verifying email");
  }
};
