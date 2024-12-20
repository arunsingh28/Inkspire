import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
}

const SECRET_KEY = process.env.JWT_SECRET || "secret-key";

export class JwtUtil {
  static generateToken(payload: JwtUserPayload, options?: SignOptions): string {
    return jwt.sign(payload, SECRET_KEY, options);
  }

  static verifyToken(token: string): JwtUserPayload {
    return jwt.verify(token, SECRET_KEY) as JwtUserPayload;
  }
}
