
const express = require("express");
const path = require("path");
const cors = require('cors');

const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const PORT = 3000; 

app.use(express.json());
app.use(cors())
const dbPath = path.join(__dirname, "product.db");

let db = null ; 



const initializeDBAndServer = async() => { 
    try{
        db = await open({
        filename:dbPath,
        driver:sqlite3.Database,


        });
        
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});
    } catch(e){
        console.log(`DB Error:${e.message}`)
        process.exit(1)
    }
}




// get products 

app.get('/api/products',async(request,response) => {
const getProductsQuery = `
SELECT 
 * 
FROM 
products

ORDER BY 
   id;`;
const productsArray = await db.all(getProductsQuery);

  try {

    if (productsArray){
        response.send(productsArray);
        
    }else{
        response.status(404).send("Product not found")
    }

  }catch(error){
    response.status(500).send({error: "Database error"})
  }

});


// products get id 

// Read single product 

app.get('/api/products/:id', async(request, response) => {
    const {id} = request.params 

    const getProductsQuery = `
    SELECT 
    * 
    FROM 
    products 
    WHERE 
      id = ${id}; `;

      const products = await db.get(getProductsQuery)

      try{

       if (products){
        response.send(products)
       }else{
        response.status(404).send("Product not found")
       }
        
      }catch(error){
       response.status(500).send({error: "Database error"})
      }


})



// products post 



app.post('/api/products',async(request, response) => {
    const productsDetails = request.body;
    const {
     
        image, 
        name,
        price,
        category, 
        description,
        quantity
    } = productsDetails
    

    const addProductDetails  = `
    
    INSERt INTO  
        products (image, name, price, category, description, quantity)
        VALUES(
        
        '${image}',
        '${name}',
        '${price}',
        '${category}',
        '${description}',
        '${quantity}');`;

try {
    
const dbResponse = await db.run(addProductDetails);

const productId = dbResponse.lastID;
response.send({productId:productId}) 


}catch(error){
    console.error("Error inserting product:", error.message);
    response.status(500).send({error: "Could not create product"})
}


});



// products put   


app.put('/api/products/:id',async (request,response)=> {

    const {id} = request.params 
    
    const productsDetails = request.body 
    
    const {
        image, 
        name, 
        price,
        category,
        description,
        quantity,
    }= productsDetails 
    
    const updateProductQuery = `
    
    UPDATE 
     products
    
     SET 
    
     image = '${image}',
     name = '${name}',
     price = '${price}',
     category = '${category}',
     description = '${description}',
     quantity = '${quantity}' 
    
     WHERE 
      id = ${id};`
    
      try {
        await db.run(updateProductQuery );
        response.send("Product updated successfully.");
    } catch (error) {
        response.status(500).send({ error: "Could not update data" });
    }

    
    
    });
    
    
  
    // products delete 


   app.delete("/api/products/:id",async (request, response) => {
    const {id} = request.params;

    const deleteProductQuery = `
    DELETE 
     FROM 
    products 
    WHERE 

      id  = ${id};`;


      try{
        await db.run(deleteProductQuery)
        response.send("Product Delete Successfully") 

      }catch(error){
        response.status(500).send({error: "Could not delete product"});
      }






   }) 
    
    



initializeDBAndServer()
