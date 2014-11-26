A test script for the [chat server](https://github.com/pomerantsev/ambient-chat-server).
To run:
- `npm install`
- run the chat server, either locally, or on a remote machine.
- run `node script.js <server url with port> <mean delay between outgoing messages> <size of username pool>` (if not all parameters are specified, others take default values, which can be found in the code).

When the script starts running, the sequence of steps is as follows:
- it connects to the chat server;
- it selects a username between 'user1' and 'userX', where X is the size of username pool;
- it gets the list of user's dialogs from the server (if the user with such name hasn't exchanged messages with anyone, the list is empty);
- if the list is empty, it randomly selects the other user's id from the same pool of usernames; if the list is not empty, it's going to select an existing dialog with a 50% probability (otherwise it's still randomly chosen from the whole pool);
- it starts sending random messages (lorem ipsum sentences, 1 to 10 words long) at random intervals (1/2 * mean delay ... 3/2 * mean delay).

