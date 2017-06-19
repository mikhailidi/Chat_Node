$(document).ready(function () {
    var socket = io.connect();
    var $messageBox = $('#message');
    var $chat = $('.message_container div[data-chat-name="public"]');
    var $send = $('.send');
    var $userList = $('.users_list');
    var $logIn = $('#logIn');

    
    
    $logIn.on('click', function () {
        var $main_content = $('.main_content');
        var $loginForm = $('.logInForm');
        var $userName,
            $pass,
            $nickError = $('#userAccessError')
            ;

        $userName = $('#userName').val();
        $pass = $('#password').val();
        socket.emit('newUser', $userName, function (data) {
            if (data){
                $main_content.show();
                $loginForm.hide();
            } else {
                $nickError.html('Username already exists');
            }
        });

        
    });




    


    $send.on('click',function () {
        socket.emit('sendMessage', $messageBox.val(), function (data) {
            $chat.append(
                '<div class="bg-danger"><p>'+data+'</p></div>'
            );
        });
        $messageBox.val('');
    });


    socket.on('loadOldMsg', function (docs) {
        console.log(docs);
        //for (var i = docs.length-1; i >= 0; i--){
        for (var i = 0; i < docs.length; i++){
            $chat.append(
                '<div class="message">'+
                '<span class="author">'+docs[i].nick+', '+docs[i].created+'</span>'+
                '<p>'+docs[i].msg+'</p>'+
                '</div>'
            );
        }
        scrollBottom();
    });



    socket.on('newMessage', function (data) {
        displayMessage(data);
        scrollBottom();
    });

    socket.on('newPrivateMessage', function (data) {
        $chat.append(
            '<div class="message">'+
            '<span class="author">'+data.userName+', '+data.time+'</span>'+
            '<p>'+data.msg+'</p>'+
            '</div>'
        );
    });

    socket.on('usernames', function (data) {

        var html = '';
        for (i=0; i<data.length; i++){
            if (i == 0){
                html += '<div class="user active_chat" data-user-name="public"> <p><i class="fa fa-users" aria-hidden="true"></i> Publiczny</p> </div>';
            }
            var user_name = data[i];
            html += '<div class="user" data-user-name="'+user_name+'"><p><i class="fa fa-user" aria-hidden="true"></i> '+user_name+'</p></div><div class="cleaner"></div>';
        }
        $userList.html(html);

    });

    socket.on('deleteUser', function (data) {
        deleteUser(data.userName);
    });






    /* FUNCTIONS */
    function deleteUser(userName) {
        var $userList = $('.users_list');

        $userList.find('div[data-user-name="'+userName+'"]').remove();
    }
    
    
    function displayMessage(data) {
        $chat.append(
            '<div class="message">'+
            '<span class="author">'+data.userName+', '+data.time+'</span>'+
            '<p>'+data.msg+'</p>'+
            '</div>'
        );
    }
    
    
    
    
    function logIn() {

    }

    function scrollBottom() {
        $(".message_container").animate({ scrollTop: $('.message_container').height() }, "slow");
    }

});