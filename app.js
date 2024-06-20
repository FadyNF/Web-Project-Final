const express = require('express');
const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo');


const homePageRoute = require("./routes/index-route");
const aboutUsPageRoute = require('./routes/about-us-route');
const cookbookRoute = require("./routes/cookbook-route");
const hiwRoute = require('./routes/how-it-works-route');
const ourPlansRoute = require('./routes/our-plans-route');
const sustainabilityRoute = require('./routes/sustainability-route');
const sourcingRoute = require('./routes/sourcing-route');
const loginSignupRoute = require('./routes/login-signup-route');
const userRoute = require('./routes/user-route');
const adminRoute = require('./routes/admin-route');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


app.set("view engine", "ejs");


app.use(
  session({
    secret: 'your_secret_key', // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://omneya:KA37rzgOS2iyj5X1@freshbites.wagcbow.mongodb.net/?retryWrites=true&w=majority&appName=freshbites",
      collectionName: 'sessions'
    }),
    cookie: { maxAge:  60 * 1000 } // 3 hours
  })
);


app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


app.use('/', homePageRoute);
app.use('/about-us', aboutUsPageRoute)
app.use('/how-it-works', hiwRoute);
app.use('/our-plans', ourPlansRoute);
app.use('/sustainability', sustainabilityRoute);
app.use('/sourcing', sourcingRoute);
app.use('/login-signup', loginSignupRoute);
app.use('/user', userRoute);
app.use('/admin', adminRoute);



mongoose
  .connect(
    "mongodb+srv://omneya:KA37rzgOS2iyj5X1@freshbites.wagcbow.mongodb.net/?retryWrites=true&w=majority&appName=freshbites"
  )
  .then(() => {
    console.log("Connected to database successfully!");
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((error) => {
    console.log("Failed to connect to the database!");
    console.error(error);
  });

app.use("/", homePageRoute);
app.use("/about-us", aboutUsPageRoute);
app.use("/how-it-works", hiwRoute);
app.use("/our-plans", ourPlansRoute);
app.use("/sustainability", sustainabilityRoute);
app.use("/sourcing", sourcingRoute);
app.use("/cookbook", cookbookRoute);
