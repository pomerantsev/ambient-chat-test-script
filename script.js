var io = require('socket.io-client');

var options = {
  url: process.argv[2] || 'http://localhost:8080',
  meanDelay: process.argv[3] || 30000,
  meanLength: process.argv[4] || 50,
  maxUserNumber: process.argv[5] || 1000
};

var client = io(options.url, {
  transports: ['websocket'],
  'force new connection': true
});

function getRandomUserNumber () {
  return Math.floor(Math.random() * options.maxUserNumber);
}

var currentUserNumber = getRandomUserNumber();

console.log('Connecting to ' + options.url);

client.emit('login', {id: 'user' + currentUserNumber}, function () {
  console.log('Connected as user' + currentUserNumber);
  client.emit('getDialogs', function (dialogs) {
    function getRandomOtherUserNumber () {
      var number;
      do {
        number = getRandomUserNumber();
      } while (number === currentUserNumber)
      return number;
    }

    var otherUserId;

    // If dialogs exist, select one of those users to chat with,
    // with a 50% probability.
    if (dialogs.length && Math.random() < 0.5) {
      otherUserId = dialogs[Math.floor(Math.random() * dialogs.length)]._id;
      console.log('Selecting ' + otherUserId + ' from existing dialogs.');
    } else {
      otherUserId = 'user' + getRandomOtherUserNumber();
      console.log('Randomly selecting the other user.');
    }

    client.emit('startSession', otherUserId, function () {
      console.log('Started session with ' + otherUserId);
      client.on('message', function (message) {
        if (message.from === 'user' + currentUserNumber) {
          console.log('Sent message ' + message.text + ' to ' + message.to);
        } else {
          console.log('Received message ' + message.text + ' from ' + message.from);
        }
      });

      function sendMessage () {
        client.emit('message', {
          to: otherUserId,
          text: 'blah'
        });
        setTimeout(sendMessage, 5000);
      }

      sendMessage();
    });
  });
});
