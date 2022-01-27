import fs from 'fs'
import express from 'express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/',(req,res)=>{
    let arr=[]
    res.writeHead(200,{'Content-type':'text/html'})
    let body = ''
    fs.readFile('emp.txt','utf-8',(err,data)=>{
        if(err) throw err
        arr = JSON.parse(data)
        arr.map((emp,id)=>
        body+=`<tr><td>${emp.name}</td><td>${emp.email}</td><td>${emp.mobile}</td><td>${emp.salary}</td><td>${emp.empid}</td><td><a href="/delete/${id}"><button>Delete</button></a><a href="/update/${id}"><button>Update</button></a></td></tr>`
        )
        let empData = fs.readFileSync('Table.html')
        res.write(`${empData} ${body} </tbody></table></body></html>`)
        res.end()
    })
})
app.get('/addemp',(req,res)=>{
    res.sendFile('Form.html',{root:'.'})
})
app.post('/post',(req,res)=>{
    let arr=[]
    fs.readFile('emp.txt',(err,data)=>{
        if(err) throw err
        arr=JSON.parse(data)
        arr.push(req.body)
       fs.writeFile("emp.txt",`${JSON.stringify(arr)}`,(err)=>{
           if(err) throw err
           res.end()
       })
    })
   
   res.writeHead(302, { 'Location':" http://localhost:8000/" });
})

app.get('/delete/:id',(req,res)=>{
    let arr = [];
    fs.readFile('emp.txt',(err,data)=>{
        if(err) throw err
        arr = JSON.parse(data)
        arr.splice(req.params.id,1)
        fs.writeFile('emp.txt',`${JSON.stringify(arr)}`,(err)=>{
            console.log(err);
            // res.end()
        })
    })
    res.redirect('back')
})
app.get("/update/:id",(req,res)=>{
    let det = [];
    const id = req.params.id
    fs.readFile('emp.txt',(err,data)=>{
        det = JSON.parse(data)
        res.write(`<!DOCTYPE html>
        <html lang="en">
        <body>
            <form method="post" class="m-3" action='/update_data'>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Your Name</label>
                  <input type="text" class="form-control" name="name" id="exampleInputEmail1" value=${det[id].name}>
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">Email Address</label>
                  <input type="email" class="form-control"  name="email" value=${det[id].email} >
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">Mobile</label>
                  <input type="number" class="form-control"  name="mobile" value=${det[id].mobile} >
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">salary</label>
                  <input type="text" class="form-control"  name="salary" value=${det[id].salary} >
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">empid</label>
                  <input type="number" class="form-control"  name="empid" value=${det[id].empid} >
                </div>
                <button type="submit" class="btn btn-primary">Update</button>
              </form>
        </body>
        </html>`)
        res.end()
        app.post('/update_data',(req,res)=>{
            det[id].name=req.body.name
            det[id].email=req.body.email
            det[id].mobile=req.body.mobile
            det[id].salary=req.body.salary
            det[id].empid=req.body.empid

            data=det
            fs.writeFile('emp.txt',`${JSON.stringify(data)}`,(err)=>{
                if(err) throw err;
            })
            res.redirect('http://localhost:8000/')
        })
    })
})


app.listen(8000)