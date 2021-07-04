

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
    var q,s,u,a
    function getvalues(){
        q=document.getElementById('question').value
        s=document.getElementById('options').value
        u=document.getElementById('userid').value
    }
    function getid(){
        u=document.getElementById('userid').value

    }

    const arrToInstanceCountObj = arr => arr.reduce((obj, e) => {
        obj[e] = 0;
        return obj;
        }, {});

    document.getElementById('submit').onclick = async function(){
        getvalues()
        if (q!="" && s!=""){
            var a = s.split(',')
            var p = arrToInstanceCountObj(a)
            p.question = q
            p.totalvotes=0
            console.log(p)
            var database= firebase.database()
            var d = Date.now()
            database.ref('questions/'+d).set({p})
            const usersRef = database.ref('users');
            const hRef = usersRef.child(u);
            var arr = []
            await hRef.once('value', (snapshot) => {
                user = snapshot.val()
                arr = user.questionsasked
                
                if (arr[0]===0){
                    arr[0]=d
                    
                }else{
                    arr.push(d)
                }
                return arr
                
                
                

            })
            hRef.update({
                    questionsasked: arr
                });
            
            

            document.getElementById('question').value=""
            document.getElementById('options').value=""


        }
    }

    
    var l=[]
    async function display(){
        getid()
        await firebase.database().ref('users/'+u).once('value',(snapshot) =>{
            temp1 = snapshot.val()
            l = temp1.questionsvoted
        })
        const ref = firebase.database().ref('questions')
        ref.once('value',  (snapshot) => {
            snapshot.forEach( (childSnapshot) => {
                const userkey = childSnapshot.key
                if(l.includes(userkey)){
                    const hRef = firebase.database().ref('questions/'+ userkey + '/' + 'p');
                    hRef.once('value', (snapshot) =>{
                        votes = snapshot.val()
                        a1=[]
                        b1=[]
                        q1 = votes.question
                        b1=Object.keys(votes)
                        var index = b1.indexOf('question');
                        if (index > -1) {
                        b1.splice(index, 1);
                        }
                        var index = b1.indexOf('totalvotes');
                        if (index > -1) {
                        b1.splice(index, 1);
                        }
                        b1.forEach((element) =>{
                            t1 = votes[element]
                            t4 = votes.totalvotes
                            t2=(t1/t4)*100
                            t2 = Math.round(t2)
                            a1.push(t2)

                        })
                    })
                    var div = document.createElement('div')
                    div.classList.add('card');
                    div.classList.add('d-flex')

                    div.id = userkey
                    document.getElementById('polls').appendChild(div)
                    var h1 = document.createElement('h4')
                    var q2 = q1
                    if (q2.slice(-1) === "?"){
                        h1.innerHTML = q2
                    }
                    else{
                        
                        h1.innerHTML = q2.concat("?")
                    }
                    document.getElementById(userkey).appendChild(h1)
                    count=0
                    b1.forEach((option) =>{
                        
                        var option1 = document.createElement('label')
                        option1.innerHTML = b1[count] + ": " + a1[count] + "%"
                        document.getElementById(userkey).appendChild(option1)
                        count=count+1

                    })
                    

                }else{
                ref.child(userkey+"/"+"p").once('value', (snapshot1)=>{
                        question1=snapshot1.val()
                        var div = document.createElement('div')
                        div.classList.add('card')
                        div.classList.add('d-flex')
                        div.id = userkey
                        document.getElementById('polls').appendChild(div)
                        var text = document.createElement('h4');
                        var q2 = question1.question
                        if (q2.slice(-1) === "?"){
                            text.innerHTML = q2
                        }
                        else{
                            
                            text.innerHTML = q2.concat("?")
                        }
                        document.getElementById(userkey).appendChild(text);
                        arr = Object.keys(question1)
                        var index = arr.indexOf('question');
                        if (index > -1) {
                        arr.splice(index, 1);
                        }
                        var index = arr.indexOf('totalvotes');
                        if (index > -1) {
                        arr.splice(index, 1);
                        }
                        arr.forEach((count) =>{
                            var div2 = document.createElement('div')
                            var btn = document.createElement("input");
                            btn.type = "radio";
                            btn.name= userkey
                            btn.value = count
                            document.getElementById(userkey).appendChild(div2);
                            var lab = document.createElement('label')
                            lab.innerHTML=count
                            document.getElementById(userkey).appendChild(lab);
                            div2.appendChild(btn)
                            div2.appendChild(lab)

   
                        })
                        var btn1 = document.createElement('input')
                        btn1.type = 'button'
                        btn1.value = 'Vote'
                        btn1.id = userkey
                        btn1.setAttribute("onClick","submitvote()");
                        btn1.classList.add('btn')
                        btn1.classList.add('btn-primary')
                        document.getElementById(userkey).appendChild(btn1)
                    

                    
                 })
                }
                
              });

         });
    }

    async function submitvote() {
        getid()  
        var j = event.srcElement.id
        var rates = document.getElementsByName(j);
        var rate_value;
        for(var i = 0; i < rates.length; i++){
            if(rates[i].checked){
                rate_value = rates[i].value;
            }
            
        }
        var result =0
        var total =0
        var a=[]
        var b
        await firebase.database().ref('questions/'+ j + '/' + 'p').once('value', (snapshot) =>{
            votequestion = snapshot.val()
            result =votequestion[rate_value]
            total = votequestion.totalvotes
            result=result+1
            total =total+1
            

        })
        const hRef = firebase.database().ref('questions/'+ j + '/' + 'p');
        await hRef.update({
                    [rate_value]: result,
                    totalvotes: total
                });
        await hRef.once('value', (snapshot) =>{
            votes = snapshot.val()
            q1 = votes.question
            b=Object.keys(votes)
            var index = b.indexOf('question');
            if (index > -1) {
            b.splice(index, 1);
            }
            var index = b.indexOf('totalvotes');
            if (index > -1) {
            b.splice(index, 1);
            }
            b.forEach((element) =>{
                t1 = votes[element]
                t4 = votes.totalvotes
                t2=(t1/t4)*100
                t2 = Math.round(t2)
                a.push(t2)

            })


        })
        
        resultview(a,b,j,q1)
        
        const uRef = firebase.database().ref('users/'+u)
        await uRef.once('value', (snapshot) => {
                user = snapshot.val()
                v=user.votesgiven
                v=v+1
                arr = user.questionsvoted
                
                if (arr[0]===0){
                    arr[0]=j
                    
                }else{
                    arr.push(j)
                }
                
                
                
                

            })
            
            uRef.update({
                    questionsvoted: arr,
                    votesgiven: v
                });
            
            


        


            

                
    }

    function resultview(a,b,j,q1){
        document.getElementById(j).innerHTML = ""
        var h = document.createElement('h3')
        h.innerHTML = "Result"
        document.getElementById(j).appendChild(h)
        var h1 = document.createElement('h4')
        h1.innerHTML = q1
        document.getElementById(j).appendChild(h1)
        count=0
        b.forEach((option) =>{
            var option1 = document.createElement('label')
            option1.innerHTML = b[count] + ": " + a[count] + "%"
            document.getElementById(j).appendChild(option1)
            count=count+1
            linebreak = document.createElement('br')
            document.getElementById(j).appendChild(linebreak)


        })
    }
    
    
    

    

    
    
    window.onload = display 

