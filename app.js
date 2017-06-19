var functions = require('./functions.js'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mongoose = require('mongoose'),
    users = {}
;
console.log('Socket.io has been started');
server.listen(3666);

/* START MONGO DB */
mongoose.connect('mongodb://127.0.0.1:27017/chat/', function (err) {
  if (err){
    console.log(err);
  } else {
    console.log('MongoDB has been started !');
  }
});

var chatSchema = mongoose.Schema({
  nick: String,
  msg: String,
  created: {type: Date, default: Date.now()}
});
var Chat = mongoose.model('Message', chatSchema);

/* START LOADING SERVER */

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendfile(__dirname+'/index.html');
});

io.sockets.on('connection', function (socket) {




  socket.on('newUser', function (data, callBack) {
    /*
        <DELETE * FROM DB>
        var select = Chat.find({}).remove().exec();
    */

    var select = Chat.find({});
    select.sort('-created').limit(8).exec(function (err, docs) {
      if (err) throw err;
      console.log('Loading old messages...');
      socket.emit('loadOldMsg', docs);
    });
    if (data in users){
      callBack(false);
    } else {
      callBack(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
      updateNicknames();
      console.log('Użytkownik '+socket.nickname+' został zalogowany');
      //io.sockets.emit('usernames', users);
    }
  });

  socket.on('sendMessage', function (data, callback) {
    var msg = data.trim();
    var time = functions.data.getDateTime();
    if (msg.substring(0,3) === '/w '){ // IF IT'S PRIVATE MWSSAGE
      msg = msg.substr(3);
      var ind = msg.indexOf(' ');
      if(ind != -1){ // IF USER IS LOGED IN
        var name = msg.substr(0,ind);
        var msg = msg.substr(ind + 1);
        if (name in users){
          users[name].emit('newPrivateMessage', {msg: msg, userName: socket.nickname, time: time });
          //console.log('whisper');
        } else {
          //console.log('Error ! No user with this name');
          callback('Error ! No user with this name');
        }

      } else {
        callback('Error ! Your message is empty !');
      }
    } else { // NORMAL MESSAGE

      var newMsg = new Chat({msg: msg, nick: socket.nickname});
      newMsg.save(function (err) {
        if (err) throw err;
        io.sockets.emit('newMessage', {msg: msg, userName: socket.nickname, time: time});
      });
    }
    //socket.broadcast.emit('newMessage', data);
  });

  socket.on('disconnect', function (data) {
        if (!socket.nickname) return;
        delete users[socket.nickname];
        io.sockets.emit('deleteUser', {userName: socket.nickname});
        updateNicknames();

    });


    /* FUNCTIONS */
    function updateNicknames(nickName) {
        io.sockets.emit('usernames', Object.keys(users));
    }

}); // END SOCKETS.IO
