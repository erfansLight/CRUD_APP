import pool from "../../config/db.js";
import jwt from "jsonwebtoken";

export async function Register(name, mail, password = null, phone = null) {
  try {
    const existingUser =
      "SELECT * FROM users WHERE email = $1 or phonenumber = $2";
    const { rows } = await pool.query(existingUser, [mail, phone]);

    if (rows.length > 0) {
      return false;
    } else {
      const insertQuery = `
      INSERT INTO users (username, email, phonenumber, userpass)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, username, email, role
    `;
      const values = [
        name || "Google User",
        mail,
        phone || mail,
        password || mail,
      ];
      const result = await pool.query(insertQuery, values);
      const { id, email, role, username } = result.rows[0];
      // console.log(result.rows[0]);

      const payload = {
        id: id,
        email: email,
        role: role,
        name: username,
      };
      const RegisterToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      return RegisterToken;
    }
  } catch (error) {
    return false;
  }
}

