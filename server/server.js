import express from 'express'
import {getUserByName,getUsers,createUser,getUserByUsernameOrEmail} from './database.js'
import cors from 'cors'

const app=express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    return res.json({ message: 'Hello, World!' });
 })

 app.get('/users', async(req,res)=>{
    const users= await getUsers();
    res.send(users);
 })

 app.get('/users/:username', async(req,res)=>{
    const username=req.params.username;
    const users= await getUserByName(username);
    res.send(users);
 })

 //try to create user in the database , returning the suitable status,message in the response.
 app.post('/register',async(req,res)=>{
   const { username, userpassword, usermail } = req.body;

      try {
         // Check if the username or email already exists
         const existingUser = await getUserByUsernameOrEmail(username, usermail);

         if (existingUser.length > 0) {
         // User with the provided username or email already exists
         return res.status(400).json({ success: false, message: 'Username or email already exists' });
         }

         // If the username and email are unique, proceed with user creation
         const result = await createUser(username, userpassword, usermail);
         console.log(result);
         return res.status(200).json({ success: true, message: 'User created successfully' });
      } catch (error) {
         console.error('Error creating user:', error);
         return res.status(500).json({ success: false, message: 'Internal server error try again' });
      }
 })

app.listen(8081, ()=>{
    console.log("Listening");
})

