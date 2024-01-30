const express = require('express');
const cors= require('cors');
const axios = require('axios');

const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.get("/getAllCurrencies",async (req,res)=>{
    const nameURL = `https://openexchangerates.org/api/currencies.json?prettyprint=false&show_alternative=false&show_inactive=false&app_id=3b867dc79138406a926654f42fd0ceba`;
   
    try{
        const namesResponse = await axios.get(nameURL);
        const nameData = namesResponse.data;
        return res.json(nameData);
    }catch(err){
        console.error(err);
    }
});

//get the target amount
app.get("/convert",async(req,res)=>{
    const  {date,sourceCurrency,targetCurrency,amountInSourceCurrency} = req.query;

    try{
       const dataUrl = `https://openexchangerates.org/api/historical/${date}.json?app_id=3b867dc79138406a926654f42fd0ceba`;
    
    const dataResponse = await axios.get(dataUrl);
   const rates = dataResponse.data.rates;

   //rates
   const sourceRate = rates[sourceCurrency];
   const targetRate= rates[targetCurrency];

   //final target value
   const targetAmount = (targetRate/sourceRate) * amountInSourceCurrency;
   return res.json(targetAmount.toFixed(2));
   

    }catch(err){
        console.error(err);
    }
})

//listen
app.listen(5000,()=>{
    console.log("server started");
})

//Calculation

//AED : 3.672975 = ERN : x
//AED / 3.672975 = ERN / x
//x= (ERN / AED) * 3.672975

//targetAmo = (targetRate/SourceRate) * AmountinSourceCurency