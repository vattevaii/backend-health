const dotenv = require("dotenv");
dotenv.config();
// require("./passport");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const { MONGO_URL, APP_PORT } = process.env;
const Grid = require("gridfs-stream");
const path = require("path");

// middlewares
app.use(express.json());
app.use(morgan("common"));
// app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:8080",
//     method: "GET,POST,PUT,DELETE",
//     credentials: true,
//     "Access-Control-Allow-Origin": "*"
//   })
// );
var corsOptions = {
  origin: '*',
  methods: '*',
}
app.use(cors(corsOptions))
app.set("trust proxy", true);
app.use(
  cookieSession({
    name: "session",
    keys: ["mykey"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const recordRoutes = require("./routes/records");
const questionRoutes = require("./routes/questions");
const commentRoutes = require("./routes/comments");

// Create mongo connection
mongoose.connect(
  MONGO_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  () => console.log("Connected to DB!")
);

const conn = mongoose.createConnection(MONGO_URL);

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("PostImages");
});

const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

// create storage engine
const fsStorage = new GridFsStorage({
  url: MONGO_URL,
  file: (req, file) => {
    // console.log('query', req.query)
    const { type } = req.query;

    let filename = type + "." + Date.now() + path.extname(file.originalname);
    let isUser = false;
    let isQuestion = false;
    let isComment = false;

    if (type === "user") {
      isUser = true;
      bucketName = "UserImages";
    } else if (type === "question") {
      isQuestion = true;
      bucketName = "QuestionImages";
    } else {
      isComment = true;
      bucketName = "CommentImages";
    }

    return {
      filename,
      bucketName,
      metadata: {
        bucketName,
        type: req.query.type,
        originalname: file.originalname,
        username,
        isProfile,
        isCover,
        isPost,
        postId,
      },
    };
  },
});

const fsUpload = multer({ storage: fsStorage });

// To upload an image
app.post("/api/upload", fsUpload.single("file"), async (req, res) => {
  try {
    return res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello from My-Health-Solution");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/comments", commentRoutes);

app.listen(8080, "0.0.0.0", () => console.log(`Server started on port 5000`));
