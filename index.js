import express from "express";
import {pool} from "./db/config.js";
import createUser from "./migration.js";


const app = express();
const PORT = 3000;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Hello from Express + ESM!");
});

app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const [result] = await pool.query('SELECT * FROM user WHERE user_email = ? AND user_password = ?', [email, password]);
    if (result.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.status(200).json({ message: 'Login successful',id: result.insertId, email });
  })

app.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if(!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    try{
      const existingUser = await pool.query('SELECT * FROM user WHERE user_email = ?', [email]);
      if (existingUser[0].length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const [results] = await pool.query('INSERT INTO user (user_name, user_email, user_password) VALUES (?, ?, ?)', 
      [name, email, password]);
      return res.status(200).json({ message: 'User created successfully', userId: results.insertId, name,email });
    }catch (error) {
        console.error('Error inserting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  })


pool.getConnection()
.then(()=>{
    console.log("Connected to the database");
}).then(createUser)
.then(()=>{
    console.log("User table created");
})
.then(()=>{

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
})

export default app;