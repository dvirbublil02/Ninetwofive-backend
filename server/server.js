import express from 'express'
import {getUserByName,getUsers,getLogin} from './database.js'
import cors from 'cors'

const app=express();
app.use(cors());
app.use(express.json());

 app.get('/users', async(req,res)=>{
    const users= await getUsers();
    res.send(users);
 })

 app.get('/users/:username', async(req,res)=>{
    const username=req.params.username;
    const users= await getUserByName(username);
    res.send(users);
 })

//login checking and connecting 
 app.post('/login', async (req, res) => {
   const { username, userpassword } = req.body;

  try {
    const result = await getLogin(username, userpassword);

    if (result.length > 0) {
    
      // Send success response to the client
      res.status(200).json({ success: true, user: result[0] });
    } else {
      // No matching user; login failed
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    // Handle database error
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
 });

 
app.listen(8081, ()=>{
    console.log("Listening");
})

