const express = require('express')
const bcrypt = require('bcrypt')
const firebase = require('firebase')
const querystring = require('querystring');

var firebaseConfig = {
    apiKey: "AIzaSyBOdWG4Fs2WSXzMVMQU8piwT9h7K7g59fc",
    authDomain: "voting-website-147ca.firebaseapp.com",
    databaseURL: "https://voting-website-147ca-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "voting-website-147ca",
    storageBucket: "voting-website-147ca.appspot.com",
    messagingSenderId: "519163362390",
    appId: "1:519163362390:web:5e07ea5374455c4c31cff7",
    measurementId: "G-2XDX2CGFNC"
  };
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

const app = express()

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.static('views'))

app.get('/', (req, res) =>{
    res.render('login.ejs')
})

app.get('/home',(req, res)=>{
    person = req.query
    res.render('index.ejs', {person})
})

  


app.get('/login', (req, res) =>{
    res.render('login.ejs')
})

app.get('/register', (req, res) =>{
    res.render('register.ejs')
})

app.post('/register', async(req, res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        var i = Date.now().toString()
        firebase.database().ref('users/'+i).set({
            id: i,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            votesrecieved: 0,
            votesgiven: 0,
            questionsasked: [0],
            questionsvoted: [0]
          });
        var t = {
            id: i,
            name: req.body.name
        }
        const query = querystring.stringify(t);
        res.redirect('/home?' + query);
        console.log('success')


    }catch{
        res.redirect('/register')
    }
    
})

app.post('/login', async(req, res)=>{
    const ref = database.ref('users');
    ref.orderByChild('email').equalTo(req.body.email).once('child_added', async(snapshot) => {
        const user = snapshot.val()
        if (user==null){
            console.log('user does not exist')
        }
        try{
            if(await bcrypt.compare(req.body.password, user.password)){
                var t = {
                    id: user.id,
                    name: user.name
                }
                const query = querystring.stringify(t);
                res.redirect('/home?' + query);
                console.log('success')
              
            }else{
                console.log('wrong password')
            }
        }catch(e){
            console.log(e.stack)
        }
    });

})
   




const port = process.env.PORT || 3003;



app.listen(port, ()=>console.log("listening"))