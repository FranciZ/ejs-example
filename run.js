const express = require('express');
const request = require('request');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
require('mailin-api-node-js');



app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/libs', express.static('libs'));
app.use('/static', express.static('static'));

app.listen(3030, ()=>{

    console.log('All is well!');

});

app.get('/article/:id', (req, res)=>{

    var articleId = req.params.id;

    request('http://jsonplaceholder.typicode.com/posts/'+articleId, (err, response, body)=>{

        var jsonData = JSON.parse(body);

        res.render('article', { article:jsonData, pageName:'article' });

    });

});

app.get('/api/posts', (req, res)=>{

    var pageNum = req.query.page-1;
    var postCount = req.query.postCount ? req.query.postCount : 5;
    
    request('http://jsonplaceholder.typicode.com/posts', function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var jsonData = JSON.parse(body);
            var pageLength = Math.ceil(jsonData.length/postCount);
            var page = jsonData.splice(pageNum*postCount,postCount);

            res.send(page);

        }
    });

});

app.get('/portfolio', (req, res)=>{

    res.render('portfolio',{
       pageName:'portfolio'
    });

});

app.post('/api/hire', (req, res)=>{

    var body = req.body;

    var client = new Mailin("https://api.sendinblue.com/v2.0","1gD5pR4kwCX82jnr");

    var toEmail = {};

    toEmail[body.email] = 'Franci';

    ejs.renderFile('./views/email.ejs', body, function(err, result){

        if(!err) {

            data = {
                "to": {[body.email]: 'Franci'},
                "from": ["franci@proxima.si", "Franci Zidar"],
                "replyto": ["franci@proxima.si", "Franci Zidar"],
                "subject": "Job enquiry",
                "html": result
            };

            client.send_email(data).on('complete', function (data) {

                res.sendStatus(200);

            });

        }else{
            res.sendStatus(400);
        }

    });

});

app.get('/about', (req, res)=>{

    res.render('about', {
        pageName:'about'
    });

});

app.get('/', (req, res)=>{

    var pageNum = req.query.page-1;
    var postCount = req.query.postCount ? req.query.postCount : 5;


    request('http://jsonplaceholder.typicode.com/posts', function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var jsonData = JSON.parse(body);
            var pageLength = Math.ceil(jsonData.length / postCount);
            var page = jsonData.splice(pageNum * postCount, postCount);

            res.render('landing', {
                posts: page,
                numPages: pageLength,
                pageNum: pageNum,
                postCount: postCount,
                pageName:'articles'
            });
        }
    });


});