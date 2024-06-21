const http = require('http');
const fsPromises = require('fs/promises');
const fs = require('fs');
const url = require('url');

const dataText = fs.readFileSync('./data.json');
const data = JSON.parse(dataText);
const app = http.createServer(async(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"text/html"
    });
    const {route} = url.parse(req.url,true);
    switch(route){
        case '/':{
            const bf = await(fsPromises.readFile('./pages/home.html'));
            res.end(bf);
            break;
        }
        case "/products":{
            const bf = await(fsPromises.readFile('./pages/products.html'));
            
            let text = bf.toString();
            let productText="";
            for(let i=0;i<data.length;i++){
                console.log(req.query);
                productText += `<div class="product-card">
                   
                    <img src="${data[i].thumbnail}" alt='product-image'>
                    <h3>${data[i].title}</h3>
                    <p>${data[i].description}</p>
                    <a href="/view?id=${data[i].id}" target="_blank">More</a>
              </div>
            `;
            }
            text = text.replace("$PRODUCTS$",productText);
            
            res.end(text);
            break;
        }
        default:{
            res.end("<h2>Oops! Page not found...</h2>");
            break;
        }
    }
});

app.listen(9000,()=>{
    console.log('server started');
});