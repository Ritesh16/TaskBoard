// src/types/jwt.ts
export interface DecodedJwtPayload {
  sub: string; // Subject (usually user ID)
  email: string;
  name: string; // Custom claim for full name
  exp: number; // Expiration time
  iat: number; // Issued at
  // Add any other claims your token has
  [key: string]: any; // Allows for other dynamic properties
}
