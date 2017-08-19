var bitcoin = require('bitcoinjs-lib')

 var bitcoinMessage = require('bitcoinjs-message')


var backbone = require('backbone')

var Decimal = require('decimal.js');

var network = bitcoin.networks.testnet // zhe li yao gai jing



var bitcoinstr=""
var bitcorestr=""


$('select').on('change', function() {
  
  var e = document.getElementById("selectnet");
var selectnet = e.options[e.selectedIndex].value;

if(selectnet == "livenet"){
network = bitcoin.networks.bitcoin
  
  console.log(network)
}else if(selectnet == "testnet"){

network = bitcoin.networks.testnet
console.log(network)
}else{

}


})



// var keyPair = bitcoin.ECPair.makeRandom({ network: network })

var Datastore = require('nedb')
  , db = new Datastore({ filename: 'privatekeys.db', autoload: true });
db.ensureIndex({ fieldName: 'private', unique: true }, function (err) {
});

//window.$ = window.jQuery = require('./jquery-3.2.1.min.js')
var QRCode = require('qrcode')
var canvas = document.getElementById('displayqrcode')

var qrcodearray = []

var qrcodestr =""
let scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
scanner.addListener('scan', function (content) {
 
console.log(content)
  // if(content[0]== "p"){

  //   // shi si yao
  //   var privates = content.slice(2)
  //   var privateArray = privates.split(" ")


  //  // console.log(privateArray)
  //   for(var i = 0;i<privateArray.length;i++){

  //      db.insert({private:privateArray[i]})
  
  //   }


  // }else

  

if(decodeqrcode(content) == true){

   if(qrcodestr[0]== "u"){
    // unsigndata
    var unsigndata = qrcodestr.slice(2)

signdata(unsigndata)
  
  qrcodestr=""
  }else if(qrcodestr[0]== "m"){

      var unsignmessagestr = qrcodestr.slice(2)

     signmessage(unsignmessagestr)

qrcodestr=""
   
  }else{
 // qi ta qing kuang

  }


}else{


}

  scanner.stop()




  // QRCode.toCanvas(canvas, content, function (error) {
  //   if (error) console.error(error)
  //   console.log('success!');
  // })



});




function decodeqrcode(content){


   if(content[0]== "0" && content[1] =="0"){

    qrcodestr=content.slice(3)


return true



   }else if(parseInt(content[0]) >0 && parseInt(content[1]) >0){

         if(parseInt(content[0]) != parseInt(content[1])){
           
          qrcodearray[parseInt(content[1])-1] = content.slice(3)

         $("ul").append("<li>"+content[0]+"/"+content[1]+" ok </li>")

         }else if(parseInt(content[0]) == parseInt(content[1])){
             
            $("ul").append("<li>"+content[0]+"/"+content[1]+" ok </li>")
           qrcodearray[parseInt(content[1])-1] = content.slice(3)



              console.log("encodeqrcode"+qrcodearray)

              for(var i=0;i<parseInt(content[1]);i++){


                qrcodestr = qrcodestr+qrcodearray[i]
              }
              
              console.log(qrcodestr)
                return true

         }else{


         }


   

   }else{


   }



return false


}


function encodeqrcode(str){
      

       var maxlength = 888
       qrcodearray=[]
      var count = Math.ceil(str.length/maxlength)

      
     console.log("str: "+str+"  count "+count)
      for(var i=0;i<count-1;i++){
        qrcodearray[i]=str.slice(0+i*maxlength,maxlength+i*maxlength)

      }
      qrcodearray[count-1]=str.slice((count-1)*maxlength)

console.log(qrcodearray)
     for(var i=0;i<qrcodearray.length;i++){

      $("ul").append("<li id="+count+(i+1)+" class=\"btn btn-primary btn-sm\">display  "+count+"/"+ (i+1)+ "</li>")
     }

$("#displayqrcode").show()

$("li").click(function(e){
  e.preventDefault();
      
    var liid = this.id;

console.log(liid)
      var  text= liid +" "+qrcodearray[parseInt(liid[1])-1]
       
           QRCode.toCanvas(canvas, text, function (error) {
    if (error) console.error(error)
    
  })

})



    
     
}







function opencamera(){

    Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[1]);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });

}




$("#sign").click(function () {

opencamera()

$("ul").empty()
$("#textarea_privatekeys").hide()
 $("#preview").show()
 $("#displayqrcode").hide()

});



$("#listaddresses").click(function () {

 $("ul").empty()
 $("#textarea_privatekeys").hide()
 $("#preview").hide()
 $("#displayqrcode").show()
 


db.find({}, function (err, docs) {
var addressesstr =""
for(var i=0;i<docs.length;i++){

  var address = bitcoin.ECPair.fromWIF(docs[i]['private'], network).getAddress();
  $("ul").append("<li>"+address+"</li>")
  addressesstr=addressesstr+" "+address
}
console.log(addressesstr)
  //      QRCode.toCanvas(canvas, "a " +addressesstr, function (error) {
  //   if (error) console.error(error)
   
  // })
encodeqrcode("a"+addressesstr)



})




})


// $("#importprivates").click(function () {

//  opencamera()

  
// })

$("#addprivatekeys").click(function () {
$("ul").empty()
 $("#textarea_privatekeys").show()
 $("#preview").hide()
 $("#displayqrcode").hide()
 

})


$("#add").click(function () {

var lines = $("textarea").val().split('\n');
for(var i = 0;i < lines.length;i++){
    //code here using lines[i] which will give you each line
    if(lines[i].length == 52){
      db.insert({private:lines[i]})

    }
}

   $("#textarea_privatekeys").hide()
})

//dumpprivkey "1526gbL8VuGJnZMfs1S7jeBeredFaYQitV" bitcoin core client
//KwfZr6bvVheEAXf572P8vs2rJM4B97a1XvEFQ7YTHvkMSdZPkbD1
//multibit wallet 
//KxcbtfZetddz11FQf7NzTsGvMFrp1zKHSpvuU8Ctnw7eGS5mwmcn

//var allprivatestring ="cNHrj3oErSoFeZJtbQX1xx3yGP3UbFgKzbqMnrswYmiNCszDpNeM cNGAtW9tGLMfKGwuDhBAM8XUWNXNTqGawx9ryJPyEmBj7sMcNs7F";

//var unsigndata = "22 b2c31d14ac4601e63990a8575c6982d9da42d94b1105e7f4be6e510a4918bac4 0 n1ULtDyHDuGikwJL3bFrCB7E4MREpVM2jr 82ff7b627fb0d92098395931dae8c897e3a175d6cc1613c04747878a114e24c5 0 mhrh4aZwxvHN4fu189T6mzPwzJYAZZtDsG n1ULtDyHDuGikwJL3bFrCB7E4MREpVM2jr 2.5 mhrh4aZwxvHN4fu189T6mzPwzJYAZZtDsG 0.1";


//var unsigndata = "12 5a29ad71740686ec1db0d9b0df5808dd93128052daeee8f6174f10c462134d29 1 mhrh4aZwxvHN4fu189T6mzPwzJYAZZtDsG mhZ1FiFuUTiLeT8HdzfD15PxvpyPf6hJpL 1.333 mhrh4aZwxvHN4fu189T6mzPwzJYAZZtDsG 0.894"






function signdata(unsigndata){

var Privatekey = backbone.Model.extend({});
var PrivatekeyCollection = backbone.Collection.extend({
  model: Privatekey
});

var privatekeyCollection = new PrivatekeyCollection();

db.find({}, function (err, docs) {




// var Privatekey = backbone.Model.extend({});
// var PrivatekeyCollection = backbone.Collection.extend({
//   model: Privatekey
// });

// var privatekeyCollection = new PrivatekeyCollection();




for (var i = 0; i < docs.length; i++) {

  var privatekey = new Privatekey({})

  var address = bitcoin.ECPair.fromWIF(docs[i]['private'], network).getAddress();
  privatekey.set("privatekey", docs[i]['private'])
  privatekey.set("address", address)
  privatekeyCollection.add(privatekey)
}
//console.log(privatekeyCollection.toJSON())


var unsigndataArray = unsigndata.split(" ");


console.log( "349 "+ unsigndataArray)

var Input = backbone.Model.extend({});

var InputCollection = backbone.Collection.extend({
  model: Input
});

var inputcollection = new InputCollection()
console.log(unsigndataArray[0][0].charCodeAt(0)-96)

for (var i = 0; i < unsigndataArray[0][0].charCodeAt(0)-96; i++) { // 9 input 9 output
  var input = new Input({})
  input.set("txid", unsigndataArray[5 * i + 1])
  input.set("vout", parseInt(unsigndataArray[5 * i + 2]))
  input.set("address", unsigndataArray[5 * i + 3])
  input.set("scriptPubKey", unsigndataArray[5 * i + 4])
  input.set("amount", unsigndataArray[5 * i + 5])
  inputcollection.add(input)
  console.log(input)
}
console.log(inputcollection.toJSON())


var Output = backbone.Model.extend({});

var OutputCollection = backbone.Collection.extend({
  model: Output
});

var outputcollection = new OutputCollection()

 var outputdataArray = unsigndataArray.splice(5 * (unsigndataArray[0][0].charCodeAt(0)-96) + 1)

 console.log("293333" + unsigndataArray.splice(6))
console.log(outputdataArray)

for (var i = 0; i < unsigndataArray[0][1]; i++) {

  var output = new Output({});
  output.set("address", outputdataArray[2 * i + 0])
  output.set("value", Decimal(outputdataArray[2 * i + 1]))

  outputcollection.add(output);

}

console.log(outputcollection.toJSON())



var tx = new bitcoin.TransactionBuilder(network)

for (var i = 0; i < inputcollection.length; i++) {
  tx.addInput(inputcollection.models[i].get('txid'), inputcollection.models[i].get('vout'))



}

for (var i = 0; i < outputcollection.length; i++) {

  // float bug
  var sm = new Decimal('100000000')
  var shuchujine = new Decimal(outputcollection.models[i].get("value"))
  shuchujine = parseInt(shuchujine.mul(sm).toString())
  tx.addOutput(outputcollection.models[i].get("address"), shuchujine) // 57999999.99999999 yao zai you wang duan xie hao ming tian zuo parseFloat(Math.round(num3 * 100) / 100).toFixed(0);
}

for (var i = 0; i < inputcollection.length; i++) {

  var address = inputcollection.models[i].get('address')
  var privatekey = privatekeyCollection.where({ "address": address })[0].get("privatekey")
  var keyPair = bitcoin.ECPair.fromWIF(privatekey, network)
  tx.sign(i, keyPair)


}
bitcoinstr =tx.build().toHex()
console.log(bitcoinstr)
 






//// kai shi yong bitcore zai ci build transaction  wei le anquan 



var bitcore = require('bitcore-lib'); //bu yao chong fu zhuang bitcore-lib

var tx = new bitcore.Transaction()

for(var i=0;i<inputcollection.length;i++){

        var utxo = new bitcore.Transaction.UnspentOutput({
  "txid" : inputcollection.models[i].get('txid'),
  "vout" : inputcollection.models[i].get('vout'),
  "address" :  inputcollection.models[i].get('txId'),
  "scriptPubKey" : inputcollection.models[i].get('scriptPubKey'),
  "amount" :  inputcollection.models[i].get('amount')
});


  tx.from(utxo)
}

var privatekeyarr =[]
for (var i = 0; i < inputcollection.length; i++) {

  var address = inputcollection.models[i].get('address')
  var privatekey = privatekeyCollection.where({ "address": address })[0].get("privatekey")
  
  privatekeyarr.push(privatekey)


}


for (var i = 0; i < outputcollection.length; i++) {

  // float bug
  var sms = new Decimal('100000000')
  var shuchujines = new Decimal(outputcollection.models[i].get("value"))
  shuchujines = parseInt(shuchujines.mul(sms).toString())
  tx.to(outputcollection.models[i].get("address"), shuchujines) // 57999999.99999999 yao zai you wang duan xie hao ming tian zuo parseFloat(Math.round(num3 * 100) / 100).toFixed(0);
}



 tx.sign(privatekeyarr)


    bitcorestr = tx.serialize()
console.log(bitcorestr)




  if(bitcorestr != bitcoinstr){

    console.log(bitcorestr+"!="+ bitcoinstr)
  }else{

  //      QRCode.toCanvas(canvas, "b " +bitcoinstr, function (error) {
  //   if (error) console.error(error)
  //   console.log('success!');
  // })


   encodeqrcode("b "+bitcoinstr)



   

  }



})

}



function signmessage(unsignmessagestr){


console.log(unsignmessagestr)
  var unsignaddress = unsignmessagestr.slice(0,34)
  var unsignmessage =unsignmessagestr.slice(35)


 

  db.find({}, function (err, docs) {

for(var i=0;i<docs.length;i++){

  var address = bitcoin.ECPair.fromWIF(docs[i]['private'], network).getAddress();

  if(address == unsignaddress){

var keyPair = bitcoin.ECPair.fromWIF(docs[i]['private'], network)
var privateKey = keyPair.d.toBuffer(32)

var messagePrefix = network.messagePrefix
 
var signature = bitcoinMessage.sign(unsignmessage, messagePrefix, privateKey, keyPair.compressed)
console.log(signature.toString('base64'))

encodeqrcode("m "+signature.toString('base64'))




  }else{


  }

}

  
  





})



}