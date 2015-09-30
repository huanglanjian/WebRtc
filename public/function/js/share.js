// initializing RTCMultiConnection constructor.
var connection = new RTCMultiConnection();
//定义全局变量  客户端userName
globalclientUser = '';

// using reliable-signaler
var signaler = initReliableSignaler(connection, '/');

connection.session = {
    audio: true,
    video: true,
    data: true
};
connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};
var videoConstraints = {
    mandatory: {
        maxWidth: 1920,
        maxHeight: 1080,
        minAspectRatio: 1.77,
        minFrameRate: 3,
        maxFrameRate: 64
    },
    optional: []
};
var audioConstraints = {
    mandatory: {
        // echoCancellation: false,
        // googEchoCancellation: false, // disabling audio processing
        // googAutoGainControl: true,
        // googNoiseSuppression: true,
        // googHighpassFilter: true,
        // googTypingNoiseDetection: true,
        // googAudioMirroring: true
    },
    optional: []
};
connection.mediaConstraints = {
    video: videoConstraints,
    audio: audioConstraints
};
disableInviteButton();

var videoContainer = document.querySelector('.video');
connection.onstream = function(e) {
    videoContainer.appendChild(e.mediaElement);
};

document.getElementById('open').onclick = function() {
    var sessionid = document.getElementById('session-id').value;
    if (sessionid.replace(/^\s+|\s+$/g, '').length <= 0) {
        alert('Please enter session-id');
        document.getElementById('session-id').focus();
        return;
    }
    //将用户输入的sessionid加一个用户名前缀，由于用户名是唯一的，所以该房间号也是唯一的。
    sessionid = globalclientUser + "_" +sessionid;
    alert("创建房间：" + sessionid);

    connection.channel = connection.userid = globalclientUser;
    connection.sessionid = sessionid;

    //  房间属主和sessionId
    var roomInfo = {
        owner: globalclientUser,
        channel: connection.channel,
        sessionid: connection.sessionid
    };
    signaler.socket.emit("createRoom", roomInfo);

    this.disabled = true;
    enableInviteButton();

    connection.open({
        onMediaCaptured: function() {
            signaler.createNewRoomOnServer(connection.sessionid);
        }
    });
};

document.getElementById('join').onclick = function() {
    var sessionid = document.getElementById('session-id').value;
    if (sessionid.replace(/^\s+|\s+$/g, '').length <= 0) {
        alert('Please enter session-id');
        document.getElementById('session-id').focus();
        return;
    }

    this.disabled = true;

    signaler.getRoomFromServer(sessionid, function(sessionid) {
        connection.channel = connection.sessionid = sessionid;
        connection.join({
            sessionid: sessionid,
            userid: sessionid,
            extra: {},
            session: connection.session
        });
    });
};
connection.onopen = function() {
    document.getElementById('share-file').disabled = false;
    document.getElementById('input-text-chat').disabled = false;
    document.getElementById('share-part-of-screen').disabled = false;
};
document.getElementById('share-part-of-screen').onclick = function() {
    this.disabled = true;
    connection.sharePartOfScreen({
        element: '#elementToShare',
        interval: 500
    });
};
var image = document.getElementById('preview-image');
connection.onpartofscreen = function(event) {
    this.disabled = true;
    image.src = event.screenshot;
    // connection.send(image.src);
    // console.log(event.screenshot);
};

var chatContainer = document.querySelector('.chat-output');
document.getElementById('input-text-chat').onkeyup = function(e) {
    console.log(this.value);
    if(e.keyCode != 13) return;

    // removing trailing/leading whitespace
    this.value = this.value.replace(/^\s+|\s+$/g, '');

    if (!this.value.length) return;
    var contentDiv = '<div>' + this.value + '</div>';
    var usernameDiv = '<span>' + connection.userid + '</span>';
    var sendinfo = usernameDiv + contentDiv;
    //connection.send(connection.userid+":"+this.value);
    //appendDIV(connection.userid+":"+this.value);
    connection.send(sendinfo);
    appendUser(sendinfo);
    console.log(connection.userid+":"+this.value);
    this.value =  '';
};

connection.onmessage = appendGuest;
function appendUser(event) {
    var div = document.createElement('section');
    div.className = 'user';
    div.innerHTML = event.data || event;
    console.log(event.data);
    //chatContainer.insertBefore(div, chatContainer.firstChild);
    chatContainer.appendChild(div);
    div.tabIndex = 0;
    div.focus();
    document.getElementById('input-text-chat').focus();
}

// a custom method used to append a new DIV into DOM
function appendGuest(event) {
    var div = document.createElement('section');
    div.className = 'service';
    div.innerHTML = event.data || event;
    console.log(event.data);
    //chatContainer.insertBefore(div, chatContainer.firstChild);
    chatContainer.appendChild(div);
    div.tabIndex = 0;
    div.focus();
    document.getElementById('input-text-chat').focus();
}

// 用户退出
document.getElementById('logout1').onclick = function () {
   this.setAttribute("href","logout?uname="+globalclientUser);
};

// 添加好友
document.getElementById('submitAdd').onclick = function () {
    var friend = document.getElementById('addFriend').value;
    if (friend.replace(/^\s+|\s+$/g, '').length <= 0) {
        alert('Please enter friend');
        document.getElementById('addFriend').focus();
        return;
    }
    // 发送添加好友的信号   第一个参数是主体，第二个参数是客体
    signaler.socket.emit('addFriendReq_1', globalclientUser, friend);

};

//邀请好友加入房间
document.getElementById('invite').onclick = function () {
    var friend = document.getElementById('session-id').value;
    if (friend.replace(/^\s+|\s+$/g, '').length <= 0) {
        alert('Please enter friend');
        document.getElementById('session-id').focus();
        return;
    }
    //  房间属主和sessionId
    var roomInfo = {
        owner: globalclientUser,
        channel: connection.channel,
        sessionid: connection.sessionid,
        friend: friend
    };
    if(connection.isInitiator) {
        signaler.socket.emit('inviteIntoRoom', roomInfo);
        alert("已给用户" + roomInfo.friend + "发送邀请！");
    } else {
        alert("你不是创建者!不能邀请");
    }
};

function disableInviteButton() {
    document.getElementById('invite').disabled = true;
};
function enableInviteButton() {
    document.getElementById('invite').disabled = false;
}
