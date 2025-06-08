import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signup = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const useralready = await User.findOne({ username });

    if (useralready) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res
      .status(200)
      .cookie("blogApp", token, {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "User created successfully",
        user,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res
      .status(200)
      .cookie("blogApp", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'none', // Required for cross-site cookies
        httpOnly: true, // Make sure it's inaccessible via JS
        secure: true, // Secure only in production (HTTPS)
      })
      .json({
        success: true,
        message: "User signed in successfully",
        user,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getMyProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user);

      if (!user) {
          return res.status(404).json({
              message: "User not found",
          });
      }

      res.status(200).json({
          success: true,
          user,
      });
  } catch (error) {
      console.error("Error fetching user profile:", error); // Log the actual error
      res.status(500).json({
          message: "An internal server error occurred",
      });
  }
};

const Logout = (req,res,next) => {
  try{
    res.cookie("blogApp","",{maxAge:-1});
    return res.status(200).json({
      success: true,
      message: "User logged out successfully"
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
export { signup, login, getMyProfile, Logout };
