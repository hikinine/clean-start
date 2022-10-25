import "dotenv/config";
import "./shared/infra/http/server.app"


process.on("uncaughtException", (error) => {
  console.log("entrei na ultima camada")
  console.log(error)
})