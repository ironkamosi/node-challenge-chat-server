const express = require("express");
const cors = require("cors");
const { welcomeMessage } = require("./data.js");

const app = express();
app.use(express.json());

app.use(cors());

// const welcomeMessage = {
//   id: 0,
//   from: "Bart",
//   text: "Welcome to CYF chat system!",
// };

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
// const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

/**
const welcomeMessage = [{
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
}];
 */

//Create
app.post("/messages", (req, res) => {
  const newMessage = req.body;
  console.log("req body", req.body);
  if (welcomeMessage.find((element) => element.id == newMessage.id)) {
    // make sure id does not exist
    res.status(400);
    res.send({ message: "invalid id already exist" });
  } else if (!newMessage.id || !newMessage.from || !newMessage.text) {
    res.status(400);
    res.send({ message: "bad data" });
  } else {
    welcomeMessage.push(newMessage);
    res.status(201);
    res.send(newMessage);
  }

  // res.send(newMessage);
});

// Read - gets all messages
app.get("/messages", function (request, response) {
  console.log(welcomeMessage);
  response.send(welcomeMessage);
});

// Read- (id)
app.get("/messages/:id", (req, res) => {
  const messageId = welcomeMessage.find((message) => {
    return message.id == req.params.id;
  });

  if (messageId) {
    res.send(messageId);
  } else {
    res.status(404);
    res.send({ " message": "Id not found" });
  }
});

// Delete
app.delete("/messages/:id", (req, res) => {
  // Solution 1
  const messageIndex = welcomeMessage.findIndex(
    (message) => message.id == req.params.id
  );
  if (messageIndex >= 0) {
    welcomeMessage.splice(messageIndex, 1);
  }
  // Solution 2
  // albumsData = albumsData.filter(album => album.albumId !== req.params.id);
  res.status(204); // No data
  res.end(); // Response body is empty
});

const PORT = 4003;
app.listen(PORT, () => console.log(`Your app is listening ...${PORT}`));
