const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");
const { CLIENT_RENEG_LIMIT } = require("tls");


let port = 8080;
let total = 0;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'IIST'
});
let database = 'IIST';


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); // For form data


app.get("/adduser", (req, res) => {
    res.render("adduser");  
});



app.post("/adduser", (req, res) => {
    console.log(req.body); // Debugging step
    const { id, name, city, age } = req.body;
    if (!id || !name || !city || !age) {
        return res.send("All fields are required!");
    } 

    const query = "INSERT INTO student (id , name , city, age) VALUES (?,?,?,?)";
    let user = [id, name, city, age];

    connection.query(query, user, (err, result) => {
        if (err) {
            return res.send("Error while inerting data into db..")
        } 
        console.log("Data sucessfully inserted..");
        res.redirect("/alluser");

    })
})
  

app.get("/alluser", (req, res) => {
    try {
        connection.query('SELECT * FROM student', (err, users) => {
            if (err) throw err;
            for (let i = 0; i <= users.length; i++) {
                total = i;
            }
            console.log(users);
            console.log(`there are ${total} students in the ${database} database..`);
            res.render("index.ejs", { users, total });

        })
    }
    catch (err) {
        console.log(err);

    }

});





app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
