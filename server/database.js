import mysql from 'mysql2'

import dotenv from 'dotenv';
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME

//esteblishing the connection to the database
const pool = mysql.createPool({
    host: dbHost,
    user:dbUser,
    password:dbPassword,
    database:dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise()
//this function will query and get all the users from the db return as array of objects
export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}
//this function returning the spesific user by name return as 1 object
export async function getUserByName(name){
    const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`,[name]);
    return rows[0];
}

//this is how to get the information by name
//const users= await getUserByName('naama');

//this is how to get all the user
//const users=await getUsers();

//this function will create new user with password
export async function createUser(username,userpassword,usermail){
    const [result] = await pool.query(`INSERT INTO users (username,userpassword,usermail) 
    VALUES (?,?,?)`,[username,userpassword,usermail]);
    return result;
}


  // Function to check username and password , for login 
export async function getLogin(username, userpassword) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND userpassword = ?',
      [username, userpassword]
    );
    return rows;
  }
  

  //
  export async function getProducts(type) {
    const [rows] = await pool.query('SELECT id, name, CONCAT("images/", image) AS image, price, type FROM products WHERE type = ?',[type]);
    return rows;
  }

//this function will create new product 
export async function createProduct(name,image,price,type){
  const [result] = await pool.query(`INSERT INTO products (name,image,price,type) 
  VALUES (?,?,?,?)`,[name,image,price,type]);
  return result;
}

//this is how to insert user , the id will generate automatices , result will get the message
//const result = await createUser('yossi','yossi1234');

//this function will add request to the register table
