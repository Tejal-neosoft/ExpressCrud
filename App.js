import express from 'express'
import fs from 'fs'
import {parse} from 'querystring'
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
let data = fs.readFileSync('./data.json',{encoding:'utf8', flag:'r'});
console.log("data",data);

console.log(typeof(data));
if(!data){
    fs.writeFile('data.json',JSON.stringify([]),()=>{
        console.log("WriteFile");
    })
}
app.get('/',(req,res)=>{
    // res.sendFile(`Table.html`,{root:'.'})
   let data =fs.readFileSync(`Table.html`)
    let jdata = JSON.parse(fs.readFileSync('data.json'))
    let body = ''
    jdata.map((val,id)=>
        body+=`<tr><td>${val.name}</td><td>${val.email}</td><td>${val.mobile}</td><td>${val.salary}</td><td>${val.empid}</td><td><a href="/delete/${id}"><button>Delete</button></a></td></tr>`
        )
        res.write(`${data} ${body} 
        </tbody>
        </table>
        </body>
        </html>  `
        
        )
        res.end()
})

app.get('/addemp',(req,res)=>{
    res.sendFile(`Form.html`,{root:"."})
 
})

app.post('/post',(req,res)=>{

    let test = fs.readFileSync('./data.json',{encoding:'utf8', flag:'r'}).toString();
   let test1=JSON.parse(data);

   test1.push(req.body)
     fs.writeFile('data.json',JSON.stringify(test1),(err)=>{
        console.log("Data is appended");
    })

   let d = fs.readFileSync('./data.json', {encoding:'utf8', flag:'r'});
console.log("====",d);
  
res.send("Data added")                  

})


app.listen(8000,(error)=>{
   if(error) throw error;
   console.log("Listening on port 8000");
})