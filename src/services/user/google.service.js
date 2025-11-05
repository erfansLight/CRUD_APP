import jwt from "jsonwebtoken";
import pool from "../../config/db.js";
import { Register } from "./registration.service.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const handleGoogleLogin = async (token) => {
  try {
    if (!token) throw new Error("No Google token provided.");

    const payloadBase64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    const payload = JSON.parse(payloadJson);

    const { email, name } = payload;

    if (!email) throw new Error("Google account has no email.");

    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    let user;

    if (rows.length > 0) {
      user = rows[0];
    } else {
      const jwtToken = await Register(name, email, null, null);
      const decodedAppUser = jwt.verify(jwtToken, JWT_SECRET);
      user = decodedAppUser;
    }

    const appToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.username },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    return { user, token: appToken };
  } catch (error) {
    console.error("Google login error:", error.message);
    throw new Error(error.message);
  }
};
