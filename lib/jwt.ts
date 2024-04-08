import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1d",
};

export const signJwt = (
  payload: JwtPayload,
  option: SignOption = DEFAULT_SIGN_OPTION
) => {
  const secretKey = process.env.JWT_USER_ID_SECRET!;

  // encode token with secret key
  const token = jwt.sign(payload, secretKey);

  return token;
};

export const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.JWT_USER_ID_SECRET!;

    // decode token with secret key
    const decoded = jwt.verify(token, secretKey);

    return decoded as JwtPayload;
  } catch (error) {
    console.error(error);
    return null;
  }
};
