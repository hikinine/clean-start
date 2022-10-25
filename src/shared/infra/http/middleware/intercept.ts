import { Request, Response, NextFunction } from "express";
import { logger, Color, GenerateColorByHttpMethod } from "../../../../base/utils/colorLogger"

export function interceptAndLogger(
  request: Request,
  response: Response,
  next: NextFunction
) {

  var ip = request?.headers?.["x-forwarded-for"] || request?.connection?.remoteAddress;
  process.stdout.write("\u001b[2J\u001b[0;0H");
  console.error("#")
  console.log("Request started at " + new Date().toISOString() )
  console.log("======================================================================>")
  logger([
    {
      color: Color.purple,
      message: `HTTP Request from ${ip} `
    },    
    {
      color: GenerateColorByHttpMethod(request.method),
      message: `${(request.method)} ${request.baseUrl + request.path}`
    },
    {
      color: Color.gray,
      message: `\n`+ JSON.stringify(request.body, null, 2)
    },
    {
      color: Color.gray,
      message: `\n`+  JSON.stringify(request.query, null, 2)
    }
  
  ])
  console.log("======================================================================>")

  next();


}