const express = require ('express');
const bodyParser = require ('body-parser');

const app = express();
const port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({extended: true}))

app.get('/',function(req,res){
  res.status(200).send('Hello World');
})

app.listen(port, function(){
  console.log('Listening on '+ port);
})


app.post('/hello', function(req, res, next){
  const username = req.body.user_name;
  const botPayload = {
    text: 'Hello' + username + " welcome to the dm3_recruiterbot channel! Its the best! :)"
  }

if(userName !== 'slackbot'){
  return res.status(200).json(botpayload);
}else{
  res.status(200).end();
}
})