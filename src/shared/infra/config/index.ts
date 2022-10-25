import "dotenv/config";

export const config = {
  apiVersion: process.env.API_VERSION ? `/${process.env.API_VERSION}` : "/v1",
  httpPort: process.env.HTTP_PORT || process.env.PORT || 3000,

  httpOnReady() {
    console.log(`Server started in ${config.httpPort}.`);
    console.log(`API Version: ${config.apiVersion}`);
  },  

  MAX_FILE_SIZE_MULTER: 1024 * 1024 * 5,

  jwtSecretKey: process.env.JWT_SECRET_KEY || "HEWQR349SENDFENWREWIR3249234NDSFNDSFHJUEWR",
};