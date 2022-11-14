const express = require('express') //importing express
const app = express() // initialising express in app var
const mongoose = require('mongoose')//connecting to db
//to nto type the username and pass in server.js
//const dotenv = require('dotenv')
const signUpTemplateCopy = require('./models/SignUpModels')
const componenttemplateCopy= require('./models/componentmodel')
const ordertemplateCopy= require('./models/ordermodel')
//const routeUrls = require('./routes/routes.js')
const cors = require('cors')
app.use(express.json())// activation
app.use(express.urlencoded())
app.use(cors())//initialisation
const PORT = process.env.PORT || 4000 
//require('dotenv').config()//activating env
//connect takes the link first but we dont wanna store username and pass in server hence dotenv
mongoose.connect('mongodb+srv://root:mongoroot647@cluster0.dnwerzh.mongodb.net/Robotics_club?retryWrites=true&w=majority',
 function(err) {
    if (err) throw err;
});
//body parser as middleware too

// we want route as middleware
//app.use('/app',routeUrls) //2nd arg appended to base path
//Routes
app.post('/register',(request,response) => {
    response.header("Access-Control-Allow-Origin", "*");
    const{name,email,mobilenumber,password,reEnterPassword}=request.body
    console.log("body here")
    signUpTemplateCopy.findOne({email},(err,user)=>{
        if(user)
        {
            response.send({message:"User already registered"})
        }
        else
        {
            console.log("in else")
            const signedUpUser = new signUpTemplateCopy({
                name,
                email,
                mobilenumber,
                password,// to do: change it using bicrypt
            })
            console.log(signedUpUser)
            signedUpUser.save(err=>{
                if(err){
                    response.send(err)

                }
                else{
                    response.send({message:"successfully registered"})
                }
            })
            // .then(Data =>{
            //     console.log(Data)
            //     response.json(Data) //if successful then send this response
            // })
            // .catch(error =>{
            //     console.log(error)
            //     response.json(error) //if unsuccessful then send this response
            //})
        }
    })
   

})
app.post('/login',(request,response)=>{
    response.header("Access-Control-Allow-Origin", "*");
    const{name,email,role,mobilenumber,password,reEnterPassword}=request.body
    console.log("body here")
    signUpTemplateCopy.findOne({email},(err,user)=>{
        if(user)
        {
            if(password===user.password && role==user.role)
            {
                response.send({message:"login successfull",user:user})
            }
            else if(role!=user.role)
            {
                response.send({message:`You dont have ${role} access`})
            }
            else
            {
                response.send({message:"Password doesnt match"})
            }
        }
        else
        {
            response.send("User not registered")
        }
    })
}) 
app.post('/query',(request,response)=>{
    response.header("Access-Control-Allow-Origin", "*");
    const{ operation,componentname,category,diameter,thickness, quantity, power,length}=request.body
    console.log("In query route")
    if(operation=='add')
            {
                console.log("inside add")
                const componentadd = new componenttemplateCopy({
                    componentname,
                    category,
                    diameter,
                    thickness, 
                    quantity,
                    power,
                    length
                })
                console.log(componentadd)
                componentadd.save(err=>{
                    if(err){
                        response.send(err)
    
                    }
                    else{
                        response.send({message:"successfully added"})
                    }
                })
            }
        else
        {
        componenttemplateCopy.findOne({componentname,category},(err,component)=>{
        if(component)
        {
            console.log("component found")
            if(operation==='search')
            {
                console.log("inside search")
               
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({componentname:component.componentname,
                        category:component.category,
                        diameter:component.diameter
                        ,thickness:component.thickness
                        ,quantity:component.quantity,
                        power:component.power,
                        length:component.length
                    }))
                //you can transfer data only in json 
                //response.send({message:"component found successfully "+component.componentname+ "having"+'<br/>diameter :'+component.diameter+'<br/>quantity :'+component.quantity+'<br/>thickness :'+component.thickness+'<br/>power :'+component.power+'<br/>lenth :'+component.length})
            }
            
            else if(operation==='delete')
            {
                console.log("inside delete")
                componenttemplateCopy.deleteOne({componentname})
                
           
            }
            else{
                response.send({message:"No such operation found"})
            }
        }
        else
        {
            response.send("Component not found")
        }
    
    })
}
}) 

app.post('/orderquery',(request,response)=>{
    response.header("Access-Control-Allow-Origin", "*");
    const{ operation,orderNo,orderDate,arrivalTime,cost,username}=request.body
    console.log("In order query route")
    if(operation=='add')
            {
                console.log("inside add")
                const orderadd = new ordertemplateCopy({
                    orderNo,
                    orderDate,
                    arrivalTime,
                    cost,
                    username,
                })
                console.log(orderadd)
                orderadd.save(err=>{
                    if(err){
                        response.send(err)
    
                    }
                    else{
                        response.send({message:"successfully added"})
                    }
                })
            }
        else
        {
        ordertemplateCopy.findOne({orderNo},(err,order)=>{
        if(order)
        {
            console.log("order found")
            if(operation==='search')
            {
                console.log("inside search")
               
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({orderNo:order.orderNo,
                    orderDate:order.orderDate,
                    arrivalTime:order.arrivalTime,
                    cost:order.cost,
                    username:order.username,
                    }))
                //you can transfer data only in json 
                //response.send({message:"component found successfully "+component.componentname+ "having"+'<br/>diameter :'+component.diameter+'<br/>quantity :'+component.quantity+'<br/>thickness :'+component.thickness+'<br/>power :'+component.power+'<br/>lenth :'+component.length})
            }
            
            else if(operation==='delete')
            {
                console.log("inside delete")
                ordertemplateCopy.deleteOne({orderNo})
                
           
            }
            else{
                response.send({message:"No such operation found"})
            }
        }
        else
        {
            response.send("Order not found")
        }
    
    })
}
}) 

app.post('/checkthresh',async (request,response)=>{
    response.header("Access-Control-Allow-Origin", "*");
    const{ threshold,categ}=request.body
    console.log(request.body)
    
    console.log(typeof(threshold))
    const thresh=Number(threshold)
    console.log(thresh)
    console.log("In check route")
    const component = await componenttemplateCopy.aggregate([{ $match: { $and: [ {quantity:{$lt:thresh}}, { category: categ } ] } } ])
    if(component)
    {
        //console.log(response)
        console.log(component)
        response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(component))
    }
    else
    {
        throw err;
    }
    
    
}) 
app.listen(PORT, () => console.log("server is up and running"))

//arrangement of lines in thsi order is imp