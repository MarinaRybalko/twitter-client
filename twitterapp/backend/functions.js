var request= require('request');
var config = require('./config');

functions = {
    authorize:function(req,res)
    {
        var header = config.consumerkey+':'+config.consumersecret;
        var enheader= new Buffer(header).toString(base64);
        var finalheader = 'Basic'+encheader;

        request.post('https://api.twitter.com/oauth/authorize',{form:{'grant_type':'client_credentials'},
        headers:{Authorization:finalheader}},function(error,response,body) {
            if(error)
            console.log(error);
            else{
                config.bearertoken=JSON.parse(body).access_token;
                res.JSON({success:true, data:config.bearertoken});
            }
        })
    }

}
module.exports=functions;