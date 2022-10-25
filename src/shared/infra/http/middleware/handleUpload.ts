

import { config } from './../../config/';

import multer from "multer"
import path from 'path';

const MulterOptions: multer.Options & { availableExt: string[]} = {

  availableExt: [
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".pdf"
  ],

  fileFilter: function (request: any, file: Express.Multer.File, callback: multer.FileFilterCallback){

    var ext = path.extname(file.originalname);

    
    if (! MulterOptions.availableExt.includes(ext)) {

      return callback(new Error(`Extensão do arquivo inválido. Available: ${MulterOptions.availableExt.join(", ")}`))
    }
    callback(null, true)
  },
  limits: {
    fileSize: config.MAX_FILE_SIZE_MULTER
  },

}
export const handleUploadFile = multer(MulterOptions).single("file")

