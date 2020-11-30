const express=require('express')
const app=express();
const bodyParser=require('body-parser')
var hallbookings=[],users=[],orders=[],count=0,sum=0,hsum=0;

app.use(bodyParser.json())

//List hall details
app.get("/hallbookings",(req,res)=>{
res.json(hallbookings)
})

//create new hall details
app.post("/hallbooking",(req,res)=>{
  req.body.id=hallbookings.length+1;
  console.log(req.body)  
  hallbookings.push(req.body)
  res.json({message:"hall details created"})
})

//get one hall details
app.get("/hallbooking/:id",(req,res)=>{
    let hall=hallbookings.find(e=>e.id==req.params.id)
    if(hall){
        res.json(hall)
    }else{
        res.status(404).json({
            message:"Hall Details not available"
        })
    }
})

//update hall details
app.put("/hallbooking/:id",(req,res)=>{
    let hallIndex=hallbookings.findIndex((e)=>e.id==req.params.id)
    if(hallIndex !== -1){
        req.body.id=parseInt(req.params.id)
        hallbookings[hallIndex]=req.body;
    res.json({
        message:"Hall Details updated"
    })
    }else{
        req.status(404).json({
            message:"Hall Details Not Found"
        })
    }
})

//delete hall details
app.delete("/hallbooking/:id",(req,res)=>{
    let hallIndex=hallbookings.findIndex((e)=>e.id==req.params.id)
    if(hallIndex !== -1){
        hallbookings.splice(hallIndex,1);
        res.json({
            message:"Hall Details Deleted"
        })
    }else{
        req.status(500).json({
            message:"Hall Details Not Found"
        })
    }
})

//list customers
app.get("/users",(req,res)=>{
    res.json(users)
    })
    
//create customer
    app.post("/user",(req,res)=>{
      req.body.id=users.length+1;
      console.log(req.body)  
      users.push(req.body)
      res.json({message:"user created"})
    })
    
//get one customer
    app.get("/user/:id",(req,res)=>{
        let user=users.find(e=>e.id==req.params.id)
        if(user){
            res.json(user)
        }else{
            res.status(404).json({
                message:"Hall Details not available"
            })
        }
    })
    
//update customer details
    app.put("/user/:id",(req,res)=>{
        let userIndex=users.findIndex((e)=>e.id==req.params.id)
        if(userIndex !== -1){
            req.body.id=parseInt(req.params.id)
            users[userIndex]=req.body;
        res.json({
            message:"Hall Details updated"
        })
        }else{
            req.status(404).json({
                message:"Hall Details Not Found"
            })
        }
    })
    
//delete customer details
    app.delete("/user/:id",(req,res)=>{
        let userIndex=users.findIndex((e)=>e.id==req.params.id)
        if(userIndex !== -1){
            users.splice(userIndex,1);
            res.json({
                message:"Hall Details Deleted"
            })
        }else{
            req.status(500).json({
                message:"Hall Details Not Found"
            })
        }
    })

//booking hall
    app.post("/order",(req,res)=>{
        req.body.id=orders.length+1;
        let dateArr1=req.body.startDate.split("/");
        let year=dateArr1[2];
        let month=dateArr1[1];
        let day=dateArr1[0];
        let dateStart=new Date(parseInt(year),parseInt(month)-1,parseInt(day)+1);
        let dateArr2=req.body.endDate.split("/");
        let year2=dateArr2[2];
        let month2=dateArr2[1];
        let day2=dateArr2[0];
        let dateEnd=new Date(parseInt(year2),parseInt(month2)-1,parseInt(day2)+1);
        if(orders.length===0){
            orders.push(req.body);
            res.json({message:"order created"})
        }else{
           for(i=0;i<orders.length;i++){
               let hall=orders[i].hallId;
               currDate1=orders[i].startDate.split("/")
               let currStart=new Date(parseInt(currDate1[2]),parseInt(currDate1[1])-1,parseInt(currDate1[0])+1)
               currDate2=orders[i].endDate.split("/")
               let currEnd=new Date(parseInt(currDate2[2]),parseInt(currDate2[1])-1,parseInt(currDate2[0])+1)

               if((hall==req.body.hallId)&&(currStart>=dateStart || currStart>=dateEnd )&& (currEnd<=dateStart || currEnd<=dateEnd)){
                    count++
               }
           }if(count===0){
            orders.push(req.body);
            res.json({
               message: "order created"
            })
            console.log('booked');count=0;
           }else{
               res.status(404).json({
                   message:"Hall not available"
               })
               console.log('cant book');count=0;
           }
        }
      })

//getting all the booked halls
      app.get("/orders",(req,res)=>{
        res.json(orders)
        })

//getting the value spent by customer A
      app.get("/order/:id",(req,res)=>{
            let orderval=orders.filter(e=>e.customerId==req.params.id)
         for(let n=0;n<orderval.length;n++){
             sum+=orderval[n].totalAmount
         }
            console.log(sum);
            res.json({
                message:`Total contribution by the customer-${req.params.id} : ${sum}`
            })
            sum=0;
        })

//Total Value of Hall A
        app.get("/hallvalue/:id",(req,res)=>{
            let orderval=orders.filter(e=>e.hallId==req.params.id)
         for(let n=0;n<orderval.length;n++){
             hsum+=orderval[n].totalAmount
         }
            console.log(hsum);
            res.json({
                message:`Total contribution to the hall-${req.params.id} : ${hsum}`
            })
            hsum=0;
        })
        

app.listen(3000,()=>{
    console.log('server started')
})
