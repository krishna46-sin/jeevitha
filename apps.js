var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var mongourl = "mongodb+srv://jeevitha:jeevi123@cluster0.185gw.mongodb.net/nodes?retryWrites=true&w=majority"
var cors = require('cors');
var db;
app.use(cors());
app.use(bodParser.urlencoded({extended:true}));
app.use(bodParser.json())

app.get('/',(req,res) => {
    res.send(`<a href="http://localhost:8000/loc" target="_blank">city</a> <br/> <a href="http://localhost:8000/cus" target="_blank">cusine</a> <br/> <a href="http://localhost:8000/res" target="_blank">restaurant</a> <br/> <a href="http://localhost:8000/meal" target="_blank">meal</a> <br/> <a href="http://localhost:8000/ord" target="_blank">order</a> <br/>`)
})
app.get('/loc',(req,res) =>{
    db.collection('city').find({}).toArray((err,result)=>
    {
    if(err) throw err;
    res.send(result);
    })
    })
    app.get('/cus',(req,res) =>{
        db.collection('cuisine').find({}).toArray((err,result)=>
        {
        if(err) throw err;
        res.send(result);
        })
        })

        //////restaurent
        
        app.get('/res',(req,res) =>{
            var query={}
            if(req.query.city && req.query.mealtype )
            {
                query={city:req.query.city,"type.mealtype":req.query.mealtype}
 
            }
           else if(req.query.city)
            {
                query={city:req.query.city}
            }
            else if(req.query.mealtype)
            {
                query={"type.mealtype":req.query.mealtype}
            }
            else{
                query={}
            }
            db.collection('restaurents').find(query).toArray((err,result)=>
            {
            if(err) throw err;
            res.send(result);
            })
            })
            app.get('/meal',(req,res) =>{
                db.collection('meal').find({}).toArray((err,result)=>
                {
                if(err) throw err;
                res.send(result);
                })
                })
                ////////rest details////////////////////////////
                app.get('/resdetails/:id',(req,res) => {
                    var query = {_id:req.params.id}
                    db.collection('restaurents').find(query).toArray((err,result) => {
                        res.send(result)
                    })
                })


                app.get('/list/:mealtype',(req,res) => {
                    var condition = {};
                    if(req.query.cuisine){
                        condition={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
                    }else if(req.query.city){
                        condition={"type.mealtype":req.params.mealtype,city:req.query.city}
                    }else if(req.query.lcost && req.query.hcost){
                        condition={"type.mealtype":req.params.mealtype,cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}
                    }
                    else{
                        condition= {"type.mealtype":req.params.mealtype}
                    }
                    db.collection('restaurents').find(condition).toArray((err,result) => {
                        if(err) throw err;
                        res.send(result)
                    })
                })
                

//PlaceOrder
app.post('/placeorder',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('posted')
    })
})

//order
app.get('/ord',(req,res) => {
    db.collection('order').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

///Not Require in project
//Delete Orders
app.delete('/deleteorders',(req,res) => {
    db.collection('orders').remove({_id:req.body.id},(err,result) => {
        if(err) throw err;
        res.send('data deleted')
    })
})

//Update orders
app.put('/updateorders',(req,res) => {
    db.collection('orders').update({_id:req.body._id},
        {
            $set:{
                name:req.body.name,
                address:req.body.address
            }
        },(err,result) => {
            if(err) throw err;
            res.send('data updated')
        })
})


                
MongoClient.connect(mongourl,(err,connection) => {
    if(err) throw err;
    db = connection.db('nodes');
    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })
})

