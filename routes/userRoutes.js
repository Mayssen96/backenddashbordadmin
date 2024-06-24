import express from "express";
import {
  signup,
  getoncebyName,
  getOncebyid,
  deleteOnce,
  updateOnce,
  signout,
  getAll,
  signin,
  getOncebyemail,
  count,
  updateAllUsers,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  allowedTo,
  protect
} from "../controllers/userController.js";
import { body } from "express-validator";
import jwt from 'jsonwebtoken';
export const authenticateAndAuthorize = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'yourSecretKey');

    // Extract user role from decoded token
    const userRole = decoded.role;

    // Attach user information to request object
    req.user = decoded;

    // Implement role-based access control (RBAC)
    if (userRole === 'admin') {
      // If user is admin, allow access to all routes
      return next();
    } else {
      // If user is not admin, deny access
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const router = express.Router();

const Roles = {
  USER: "user",
  ADMIN: "admin",
};


const userValidationRules = () => [
  body("firstName").isLength({ min: 3, max: 15 }).withMessage('First name must be between 3 and 15 characters.'),
  body("lastName").isLength({ min: 3, max: 15 }).withMessage('Last name must be between 3 and 15 characters.'),
  body("country").notEmpty().withMessage('Country is required.'),
  body("password")
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/\d/).withMessage('Password must contain a number.')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter.')
    .matches(/[@$!%*?&#]/).withMessage('Password must contain a special character.'),
  body("birthDate").isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('Invalid birth date format.')
    .custom(value => {
      const birthDate = new Date(value);
      const minDate = new Date('2005-01-01');
      if (birthDate > minDate) {
        throw new Error('Birth date must be after 01/01/2005.');
      }
      return true;
    })
];

router
  .route('/count')
  .get(count)
router
  .route('/signout')
  .post(signout);
  router
  .route("/login")
  .post(signin);


router
  /// ///////////////////////////////////
  .route("/verify-email")
  .get(verifyEmail);

router
  .route("/get/:firstName")
  .get(getoncebyName);
router
.route("/delete/:_id")
.put(deleteOnce);
router
.route("/getbymail/:email")
.get(getOncebyemail);

router
  .route("/:_id")
  .get(getOncebyid)

  .put(userValidationRules(), updateOnce
  )
  

router.post('/request-password-reset', requestPasswordReset);


router.post('/reset-password/:token', body("password")
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
  .matches(/\d/).withMessage('Password must contain a number.')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter.')
  .matches(/[a-z]/).withMessage('Password must contain a lowercase letter.')
  .matches(/[@$!%*?&#]/).withMessage('Password must contain a special character.'), resetPassword);

export default router;


router.route("/")
  .get(getAll)
  .post(userValidationRules(), signup)
  .put(userValidationRules(), updateAllUsers);


