var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var ejs = require('ejs-mate');
//var route = app.route();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hailong');


var userSchema = mongoose.Schema({ name: String, password: String, email: String, avatar: String });

var User = mongoose.model('User', userSchema);
app.engine('html',ejs);

app.use(bodyParser.urlencoded({ extended: false }))
//app.use(express.static(__dirname + '/views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// parse application/json 
app.use(bodyParser.json())
mailer = require('express-mailer');

mailer.extend(app, {
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
        user: '',
        pass: ''
    }
});

app.use('/web', express.static(__dirname + '/client'));


//var Hailong = new User({ name: 'Karthik' ,password:'12567',email:'knathan@eshipglobal.com',avatar:'http://www.toddstocker.com/wp-content/uploads/2016/02/Perspective-on-boss.jpg'});
//Hailong.save(function (err) {
//    if (err) {
//        console.log(err);
//    } else {
//        console.log('hailong has been saved');
//    }
//});
//var Hailong = new User({ name: 'Mark' , password: '93456', email: 'mark@eshipglobal.com', avatar: 'http://s3.crackedcdn.com/phpimages/article/8/8/2/320882_v1.jpg' });
//Hailong.save(function (err) {
//    if (err) {
//        console.log(err);
//    } else {
//        console.log('hailong has been saved');
//    }
//});
//var Hailong = new User({ name: 'Nirmalya' , password: '12345', email: 'npal@eshipglobal.com', avatar: 'http://cdn.ebaumsworld.com/picture/ff1432/InternetToughGuy2.gif' });
//Hailong.save(function (err) {
//    if (err) {
//        console.log(err);
//    } else {
//        console.log('hailong has been saved');
//    }
//});


app.get('/', function (req, res) {
    res.send("hello");
    
    console.log("render")
});

app.get('/user', function (req, res) {
    User.find({}, function (error, users) {
        if (!error) {
            console.log(users);
            res.json(users);
        }
    });
});

app.post('/user', function (req, res) {
    var user = new User({
        name: req.body.name ,
        password: req.body.password,
        email: req.body.email,
        avatar: req.body.avatar
    });
    user.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            sendEmail(user.email);
            console.log('user has been saved');
        }
    });
});

var sendEmail = function (userEmail) {
    app.mailer.send('email', {
        to: userEmail, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
        subject: 'User has been created', // REQUIRED. 
        otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
    }, function (err) {
        if (err) {
            // handle error 
            console.log(err);

            return;
        }

    });
}

app.listen(3000, function () {
    console.log("I am listening");
});
