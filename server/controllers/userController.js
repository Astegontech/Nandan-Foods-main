import User from "../models/User.js";
import jwt from "jsonwebtoken";
import admin from "../configs/firebaseAdmin.js"; // Keep for legacy Phone support if needed
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import transporter from "../configs/nodemailer.js";

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: Send Token (Login Success)
const sendToken = (user, statusCode, res, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ success: true, user: { name: user.name, email: user.email, phone: user.phone, cartItems: user.cartItems }, message });
};

// 1. SIGNUP (Email + Password) -> Send OTP
export const registerUser = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return res.json({ success: false, message: "Invalid email format" });
    if (!password || password.length < 8) return res.json({ success: false, message: "Password must be at least 8 chars" });



    // Check if user already exists
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.json({ success: false, message: "User already exists. Please login." });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    if (!user) {
      // New User
      user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        isVerified: false,
        otpHash,
        otpExpire
      });
    } else {
      // Unverified existing user (Overwrite)
      user.name = name;
      user.password = hashedPassword;
      user.phone = phone;
      user.otpHash = otpHash;
      user.otpExpire = otpExpire;
      await user.save();
    }

    // Send Email
    await transporter.sendMail({
      from: `"Nandan Foods" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Email Verification</h2>
      <p style="color: #555;">Hello,</p>
      <p style="color: #555;">
        Thank you for signing up with <strong>Nandan Foods</strong>.
        To complete your registration, please verify your email address using the OTP below:
      </p>

      <div style="margin: 20px 0; text-align: center;">
        <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #287ae4ff;">
          
          ${otp}
        </span>
      </div>

      <p style="color: #555;">
        ⏰ This OTP is valid for <strong>10 minutes</strong>.
      </p>

      <p style="color: #555;">
        ⚠️ Please do not share this code with anyone for security reasons.
      </p>

      <hr style="margin: 30px 0;">

      <p style="color: #888; font-size: 12px;">
        If you did not request this verification, please ignore this email.
      </p>

      <p style="color: #888; font-size: 12px;">
        Regards,<br>
        <strong>Nandan Foods</strong>
      </p>
    </div>
  `
    });


    res.json({ success: true, message: "OTP sent to your email. Please verify to continue." });

  } catch (error) {
    console.error("Signup Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// 2. VERIFY EMAIL OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.json({ success: false, message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.isVerified) return res.json({ success: false, message: "Email already verified. Please login." });

    if (!user.otpHash || !user.otpExpire || user.otpExpire < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (user.otpHash !== hashedOtp) {
      user.otpAttempts += 1;
      await user.save();
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Success
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ success: true, message: "Email verified successfully. Please login." });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 3. LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: "Email and Password required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified) return res.json({ success: false, message: "Please verify your email before logging in." });

    // Mobile users might not have password if they signed up via Phone OTP exclusively (edge case)
    if (!user.password) return res.json({ success: false, message: "Please try alternative login method" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    sendToken(user, 200, res, "Login Successful");

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 4. FORGOT PASSWORD (Send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Security: Always return generic message
    if (!user) return res.json({ success: true, message: "If the email exists, an OTP has been sent." });

    const otp = generateOTP();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    user.otpHash = otpHash;
    user.otpExpire = otpExpire;
    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Reset your password',
        text: `Your Password Reset OTP is: ${otp}\n\nExpires in 10 minutes.`
      });
    } catch (e) {
      console.error(e);
    }

    res.json({ success: true, message: "If the email exists, an OTP has been sent." });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 5. VERIFY RESET OTP
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.json({ success: false, message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user || !user.otpHash || user.otpExpire < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (user.otpHash !== hashedOtp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // OTP is valid. Issue a temporary "Reset Token" to allow setting password
    // This token is short-lived (5 mins) and specific to password reset purpose
    const resetToken = jwt.sign(
      { id: user._id, purpose: 'reset_password' },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    // We DON'T allow login yet. Just return token for next step.
    // We do NOT clear OTP yet? Or we rely on the JWT now?
    // Better: Clear OTP to prevent reuse, rely on JWT.
    user.otpHash = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ success: true, message: "OTP Verified. Please set your new password.", resetToken });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 6. RESET PASSWORD (Set New)
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body; // Token from prev step

    if (!resetToken) return res.json({ success: false, message: "Missing reset token" });
    if (!newPassword || newPassword.length < 8) return res.json({ success: false, message: "Password too short" });

    // Verify Reset Token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.json({ success: false, message: "Expired or invalid session. Start over." });
    }

    if (decoded.purpose !== 'reset_password') return res.json({ success: false, message: "Invalid token type" });

    // Update Password
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ success: false, message: "User not found" });

    // Extra check: email match (optional but good sanity check)
    if (user.email !== email) return res.json({ success: false, message: "Email mismatch" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password reset successful. Please login." });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// --- KEEPING FIREBASE LOGIN FOR LEGACY/PHONE IF NEEDED ---
export const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.json({ success: false, message: "ID Token required" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { phone_number, email } = decodedToken;

    if (!phone_number && !email) return res.json({ success: false, message: "Invalid Token" });

    let user = await User.findOne({ $or: [{ phone: phone_number }, { email }] });

    if (!user) {
      user = await User.create({
        phone: phone_number,
        email: email,
        isVerified: true // Firebase verified
      });
    } else {
      // If exist, ensure verified
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    sendToken(user, 200, res, "Logged in via Firebase");

  } catch (error) {
    res.json({ success: false, message: "Firebase Auth Failed: " + error.message });
  }
};

export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -otpHash -otpExpire");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
};
