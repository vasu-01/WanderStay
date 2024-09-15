//to access env data
if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express= require ("express");
const app=express();
const mongoose= require ("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

// const Listing=require("./models/listing.js");
// const wrapAsync=require("./utils/wrapAsync.js");
// const {listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");


const listings=require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter=require("./routes/user.js");

// const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main()
  .then(()=>{
    console.log("connected to db");
  })
  .catch((err)=>{
    console.log(err);
  });

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});


store.on("error",()=>{
  console.log("Error in MOngo session store",err);
});

//sessions
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}

// app.get('/',(req,res)=>{
//   res.send("hii");
// });





app.use(session(sessionOptions));
app.use(flash());


//authentication
app.use(passport.initialize());//a middleware that initialize passport
app.use(passport.session());//web application needs the ability to identify users as they browse form page to page. This series 
//of requests and resposes, each associatd with the same user , is known as session.
passport.use(new LocalStrategy(User.authenticate()));//authenticate :generate function that is used in passport's LocalStrategy. 
passport.serializeUser(User.serializeUser());//generates function that is used by passport to serialize users into the session so no need to login again and again
passport.deserializeUser(User.deserializeUser());//generates function that is used by passport to deserialize users into the session or unstore user related info from session



//middleware for success and error 
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});


// app.get("/demouser",async(req,res)=>{
//   let fakeUser= new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   });

//   let registeredUser=await User.register(fakeUser,"helloworld");//it registers user with given password and checks if username is unique
//   res.send(registeredUser);
//   // console.log(registeredUser);
// });

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);


//Express error if route is not available then this message will appears
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}=err;
  res.render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening ");
});