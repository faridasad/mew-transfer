const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const File = require("./models/File")

/* const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
  }) */

const upload = multer({ dest: "uploads" })

const app = express();

app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json())


mongoose.connect("mongodb+srv://nonwhm:bruh123@filesharing.vh4r0an.mongodb.net/?retryWrites=true&w=majority")



app.get("/upload", (req, res) => {
  res.send("hi");
});

app.post("/upload", upload.single('file'), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname
  }

  const file = await File.create(fileData)
  res.send({fileLink: `file/${file.id}`})
});

app.get("/file/:id", async (req, res) => {
  const file = await File.findById(req.params.id)
  await file.save()
  res.download(file.path, file.originalName)
})


app.listen(3000);
