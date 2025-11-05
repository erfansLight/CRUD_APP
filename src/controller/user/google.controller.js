import { handleGoogleLogin } from "../../services/user/google.service.js";

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    // console.log(`toooken = ${token}`);
    const result = await handleGoogleLogin(token);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
