const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const User = require('./models/User');
const Post = require('./models/Post');
const {users, posts} = require('./data');


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');


const {register} = require('./controllers/auth');
const {createPost} = require('./controllers/posts');


const { verifyToken } = require('./middleware/auth');

// Configuration middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });
  
  /* ROUTES WITH FILES */
  app.post("/auth/register", upload.single("picture"), register);
  app.post("/posts", verifyToken, upload.single("picture"), createPost);


//Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes)


/* mongoose setup*/

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  console.log('Connected to MongoDB');

  User.insertMany(users).then((res) => {
    console.log('Users added to database');
  }
  ).catch((error) => console.log(error.message));

 /* Post.insertMany(posts).then((res) => {
    console.log('Posts added to database');
  }
  ).catch((error) => console.log(error.message));*/

}).catch((error) => console.log(error.message));
