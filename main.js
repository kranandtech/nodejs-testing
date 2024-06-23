const http = require('http');
const fsPromises = require('fs/promises');
const fs = require('fs');
const url = require('url');

const dataText = fs.readFileSync(`${__dirname}/data.json`);
const data = JSON.parse(dataText);
const app = http.createServer(async(req,res)=>{
    res.writeHead(200,{
        "Content-Type":"text/html"
    });
    const {query,pathname} = url.parse(req.url,true);
    switch(pathname){
        case '/':{
            const bf = await(fsPromises.readFile(`${__dirname}/pages/home.html`));
            res.end(bf);
            break;
        }
        case "/products":{
            const bf = await(fsPromises.readFile(`${__dirname}/products.html`));
            
            let text = bf.toString();
            let productText="";
            for(let i=0;i<data.length;i++){
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
        case "/view":{
            // res.end(`<div><h2>This is product id = ${query.id}</h2></div>`);
            // break;
            
            const bf = await(fsPromises.readFile(`${__dirname}/pages/viewProduct.html`));
            
            let text = bf.toString();
            let productText="";
            const newData = data.filter((data)=>{
                if(data.id==query.id) return true;
                else return false;
            });
            for(let i=0;i<newData.length;i++){
                productText += `<div class="product-card">
                   
                    <img src="${newData[i].thumbnail}" alt='product-image'>
                    <h3>${newData[i].title}</h3>
                    <p>${newData[i].description}</p>
                    <p>${newData[i].price}</p>
                    
              </div>
            `;
            }
            text = text.replace("$VIEW$",productText);
            
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