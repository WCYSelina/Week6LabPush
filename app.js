
const path = require('path');
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Parcel = require('./models/parcel');
const url = "mongodb://localhost:27017/parc";
const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(express.static("public/image")); // app.use() is basically called middleware
app.use(express.static("public/css")); 
app.use('/css',express.static(path.join(__dirname,"node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"node_modules/bootstrap/dist/css")));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.listen(8080);

mongoose.connect(url,function(err){
    if(err==null){
        console.log('Connected Successfully');
        
        app.get('/',(req,res)=>{
            res.sendFile(path.join(__dirname,"views/index.html"));
        });
        app.get('tables',function(req,res){
            res.sendFile(path.join(__dirname,'/views/tables.html'))
        })
        app.get('/addparcel',(req,res)=>{
            res.sendFile(path.join(__dirname,"views/addparcel.html"));
        });
        app.post("/add",(req,res)=>{
            const obj = req.body;
            const sender = String(obj.sender);
            const address = String(obj.addr);
            const weight = parseInt(obj.weight);
            const isFragile = obj.fragile;
            if(sender.length < 3 ||address.length < 3 || weight <= 0){
                res.sendFile(path.join(__dirname,"views/invalid.html"));
            }
            else{
                let parcel = new Parcel({sender:sender,address:address,weight:weight,isFragile:isFragile});
                parcel.save(function(err){
                    if (err){
                        console.log('Unable to save'+err);
                    }
                     else{
                        console.log('Saved successfully');
                    } 
                })
                res.sendFile(path.join(__dirname,"views/index.html"));
            }   
        });
        app.get('/listparcels',(req,res)=>{
            Parcel.find({},function(err,data){
                if(err){
                    console.log(err)
                }
                else{
                    res.render("table.html",{db:data});
                }    
            })
        });
        app.get('/listbysender',function(req,res){
            res.sendFile(path.join(__dirname,"/views/listbysender.html"));
        })
        app.post("/listbysender", function (req, res) {
            let sender = req.body.listsender;
            Parcel.find({'sender':sender},function(err,data){
                if (err){
                    console.log('Unable to delete'+err);
                }
                 else{
                    res.render("table.html",{db:data});
                } 
            });
        });
        app.get('/listbyweightrange',function(req,res){
            res.sendFile(path.join(__dirname,"/views/listbyweightrange.html"));
        });
        app.post("/listbyweightrange", function (req, res) {
            let min = req.body.min
            let max = req.body.max
            Parcel.where('weight').gte(min).lte(max).exec(function(err,data){
                if (err){
                    console.log('Unable to delete'+err);
                }
                 else{
                    res.render("table.html",{db:data});
                } 
            });
            });
        app.get("/deleteparcel", function (req, res) {
            res.sendFile(path.join(__dirname,"/views/deleteparcel.html"));
        });
        app.post("/deleteparc", function (req, res) {
            let id = req.body.deleteid;
            Parcel.findByIdAndDelete(id,function(err){
                if (err){
                    console.log('Unable to delete'+err);
                }
                 else{
                    console.log('Delete successfully');
                    // res.redirect("/listparcels");
                } 
            });

            res.redirect("/"); // redirect the client to list users page
        });
        app.get('/deletebydetails',function(req,res){
            res.sendFile(path.join(__dirname,"/views/deletebydetails.html"));
        })
        app.post("/deletebydetails", function (req, res) {
            Parcel.deleteOne({'sender':req.body.deletesender},function(err){
                if (err){
                    console.log('Unable to delete'+err);
                }
                 else{
                    console.log('Delete successfully');
                } 
            });
            res.redirect("/");
            // res.redirect("/listparcels"); // redirect the client to list users page
        });
        app.get("/updateparcel", function (req, res) {
            res.sendFile(path.join(__dirname,"/views/updateparcel.html"));
        });
          //POST request: receive the details from the client and do the update
        app.post("/updateparc", function (req, res) {
            const obj = req.body;
            const sender = String(obj.sender);
            const address = String(obj.addr);
            const weight = parseInt(obj.weight);
            const isFragile = obj.fragile;
        
            if(sender.length < 3 ||address.length < 3 || weight <= 0){
                res.sendFile(path.join(__dirname,"views/invalid.html"));
            }
            else{
                let id = req.body.id;
                Parcel.findByIdAndUpdate(id,{sender:sender,address:address,weight:weight,isFragile:isFragile},function(err){
                    if (err){
                        console.log('Unable to update'+err);
                    }
                    else{
                        console.log('Update successfully');
                        // res.redirect("/listparcels");
                    } 
                });
                res.redirect("/");
                // res.redirect("/listparcels"); // redirect the client to list users page    
            }   
        });
        app.get("*",(req,res)=>{
            res.sendFile(path.join(__dirname,"views/404.html"));
        });
    }
})




