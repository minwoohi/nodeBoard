/**
 * Created by Admin on 2017-05-01.
 */
const express = require('express');

const fs = require('fs');

const app = express();

const ejs = require('ejs');

const bodyParser = require('body-parser');

// 메모리 DB 속도 빠르지만 껏다 켜면 날아감.
// MongoDB 장점 : 빠르다, 단점 : 사용이 힘들다.
let index = 0;
const items = [
    {
       'subject' : '첫번째 글',
        'memo' : '첫번째 메모',
        id : index++
    },
    {
        'subject' : '두번째 글',
        'memo' : '두번째 메모',
        id : index++
    }
];

app.use(bodyParser.urlencoded({extended: false}));

// static 자원의 default 경로 지정하겠다.
app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response){
   response.type('text/html');
   response.send('<h1>welcome index page</h1>');
});

app.get('/bye', function(request, response){
    response.type('text/html');
    response.send('<h1>Bye</h1>');
});


app.get('/file', function(request, response){
   fs.readFile('static/file.ejs', 'utf8', function(err, data){
      response.type('text/html');
      response.send(ejs.render(data, {
         title : 'ejsEx',
          name : 'minwoo'
      }));
   });
});

app.get('/memo/:id', function(request, response){
    let id = request.params.id;

    const item = items[id];

    fs.readFile('ejs/memo.ejs', 'utf8', function(err, data){
        response.type('text/html');
        response.send(ejs.render(data, {
            selectedItem : item,
            items : items
        }));
    });

});

app.get('/memo/delete/:id', function(request, response){

    let id = request.params.id;
    items.splice(id, 1);
    remakeItems(id);

    response.redirect('/memo');

});

app.put('/memo/:id', function(request, response){
    let id = request.params.id;
});

app.get('/memo', function(request, response){
    fs.readFile('ejs/memo.ejs', 'utf8', function(err, data){
        response.type('text/html');
        response.send(ejs.render(data, {
            items : items
        }));
    });
});

app.get('/write', function(request, response){
    fs.readFile('ejs/write.ejs', 'utf8', function(err, data){
        response.type('text/html');
        response.send(ejs.render(data, {
        }));
    });
});

app.post('/memo/update/:id', function(request, response){
    let id = request.params.id;

    console.log("memo/update/"+id);
    const item = items[id];

    item.subject = request.body.subject;
    item.memo = request.body.content;

    console.log('subject : ' + item.subject);
    console.log('memo : ' + item.memo);

    items[id] = item;

    response.type('text/html');
    response.redirect('/memo');
});

app.post('/write', function(request, response){
    // 외부 모듈 가져와 post 메소드의 값 가져옴
   let subject = request.body.subject;
   let content = request.body.content;

   response.type('text/html');

   const item = {};

   item.subject = subject;
   item.memo = content;
   item.id = index++;

   items.push(item);

   response.redirect('/memo');

   // 노드에서는 터미널에 데이터가 나옴.

});

app.use(function(request, response){
   response.type('text/html');
   response.sendStatus(404);
});

app.use(function(request, response){
   let name = request.query.name;
   let job = request.query.job;

   response.type('text/html');
   response.send('<h1>' + name + ', ' + job + '</h1>');
});

app.listen(3000, function(){
   console.log('Server running');
});

function remakeItems(removeIndex){
    for (let i in items ){
        console.log(items[i], removeIndex, i);
        if( i >= removeIndex ) {
            items[i].id--;
        }
    }
    index--;

    console.log(items);
}