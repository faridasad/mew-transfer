const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const File = require("./models/File");
const archiver = require("archiver");
const fs = require("fs");
require("dotenv").config();

const upload = multer({ dest: "./uploads" });
const app = express();

app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

mongoose.connect(
  process.env.MONGO_URI
);

app.post("/upload", upload.array("file"), async (req, res, next) => {
  const { files } = req;
  const { title } = req.body;

  try {
    if (files.length === 1) {
      const fileData = {
        path: files[0].path,
        originalName: files[0].originalname,
      };

      const file = await File.create(fileData);
      res.send({ fileLink: `file/${file.id}` });
    } else if (files.length > 1) {
      const zipFile = archiver("zip", { zlib: { level: 9 } });

      zipFile.on("warning", (error) => {
        console.log("warning:", error);
      });

      zipFile.on("error", (error) => {
        console.error("error occurred :", error);
      });

      const randomPath = Math.random();
      const writeStream = fs.createWriteStream(`uploads/${randomPath}`);
      zipFile.pipe(writeStream);

      await files.forEach((file) => {
        zipFile.append(fs.createReadStream(file.path), {
          name: file.originalname,
        });
      });
      await zipFile.finalize();

      files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.log(err);
        });
      });

      const fileData = {
        path: `uploads/${randomPath}`,
        originalName: `${title}.zip`,
      };

      const file = await File.create(fileData);
      res.send({ fileLink: `file/${file.id}` });
    }
  } catch (error) {
    next();
  }
});

app.get("/file/:id", async (req, res) => {
  const file = await File.findById(req.params.id);
  await file.save();
  res.download(file.path, file.originalName);
});

app.listen(process.env.PORT || 5000);
