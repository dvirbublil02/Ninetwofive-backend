import express from 'express'
import {getUserByName,getUsers,getLogin,getProducts,createProduct} from './database.js'
import cors from 'cors'
import jwt from 'jsonwebtoken';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app=express();

// Use CommonJS require syntax for express.static
app.use('/images', express.static('images'));

//images tranfering
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Set the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

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
//adding prodcut
app.post('/addProduct', upload.single('image'), async(req,res) => {
  const {name,price,type} = req.body;
  const imagePath = req.file.path;
  console.log(name,price,type,imagePath);

  try{
    const result = await createProduct(name,image,price,type);
    //console.log(result);
  } catch(error){
   // console.log(res);
  }
});

//login checking and connecting 
app.post('/login', async (req, res) => {
  const { username, userpassword } = req.body;

  try {
    const result = await getLogin(username, userpassword);

    if (result.length > 0) {
      // Generate an access token
      const accessToken = jwt.sign({ userId: result[0].idusers }, 'yourSecretKey', { expiresIn: '1h' });
      
      // Send success response with access token to the client
      res.status(200).json({ success: true, user: result[0], accessToken });
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

//import prodcut
app.get('/products', async (req, res) => {
  const type=req.query.type;
  try {
    const productsResult = await getProducts(type);
      res.json(productsResult);
      
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
app.listen(8081, ()=>{
    console.log("Listening");
})

