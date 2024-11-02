import express from "express";
import pg from "pg";
import dotenv from "dotenv";
const port = process.env.PORT || 3000;
import bodyParser from "body-parser";
dotenv.config();
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded ({extended: true}));
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "register",
    password: "alfreda.a",
    port: 5432
})
db.connect();
let open ;
let openNot;

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/register", (req, res) =>{
    res.render("register.ejs");
});

app.get("/login", (req, res) =>{
    res.render("login.ejs");
});



app.post("/register", async (req, res) =>{
    const email =  req.body.email;
    const password = req.body.password;
    const firstName = req.body.first_name;
    const checkResult = await db.query("SELECT * from register WHERE email = $1", [email]);
    if(checkResult.rows.length >0){
        res.send(`<h1 style = "padding: 16rem 30rem; color: red; font-size: 1.6rem; margin: 0 auto;">email already exist <a href =  "register" >Back</a> <h1>`);
    } else {

    const result =  await db.query("INSERT INTO register (first_name, email, password) VALUES ($1, $2, $3)",[firstName, email, password]
);
res.render("login.ejs");

    // res.render("login.ejs");
}
})



let currentUser;
let outcomes =[];

   
    db.query("SELECT * FROM register", (err, res) =>{
        if(err){
            console.log("Encountered error", err.stack)
        } else {
            outcomes = res.rows;
        }
});



app.post("/login", (req, res)=>{
    const email =  req.body.email;
    const password = req.body.password;
    currentUser =  outcomes.find(outcome => outcome.email === email);
            console.log(currentUser);
          if(currentUser?.password === password) {
            open = true;
             res.render("success.ejs", {current: currentUser, check: open});
            
            console.log(`your email is ${currentUser.email} and password is ${currentUser.password}`);
           
          } else {

            console.log("wrong credentials");
            res.send(`<h1 style = "padding: 16rem 30rem; color: red; font-size: 1.6rem; margin: 0 auto;">wrong credentials try again <a href =  "login" >Back</a> <h1>`);
          }
        
    });

    app.post("/success", (req, res) =>{
        openNot = false;
        res.render("home.ejs", {show: openNot});
    });

    app.get("/swap", (req, res) => {
        
        if(openNot === false) {
            res.send("You have been logout");
        }
        if(open === true) {
            res.render("swap.ejs")
        } else {
            res.send("Login to access this feature")
        }

    });

    


app.listen(port, () => console.log(`server is running on port ${port}`));
