import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js"


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register

  export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
   console.log("Registering user:", { name, email }); // Debug log
        const existing = await UserModel.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const user = await UserModel.create({ name, email, password });
        res.json({ success: true, userId: user._id });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Login
 export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

