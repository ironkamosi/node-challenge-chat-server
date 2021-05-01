const express = require("express");
const cors = require("cors");
const welcomeMessage = require("./data.json");

const fs = require("fs"); // feature to read&Write files
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.


app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

//Create
app.post("/messages", (req, res) => {
  let newMessage = req.body;
  console.log("req body", req.body);
  if (!newMessage.from || !newMessage.text) {
    res.status(400); // level 2
    res.send({ message: "bad data" });
  } else {
    const id = parseInt(welcomeMessage[welcomeMessage.length - 1].id) + 1; // adds 1 to the last index
    newMessage = { id, ...newMessage };
    newMessage.timeSent = new Date(); // level 4
    welcomeMessage.push(newMessage); // id from text
    res.status(201);
    // res.send(newMessage);
  }
  fs.writeFileSync("./data.json", JSON.stringify(welcomeMessage), () => {});
  res.send(newMessage);
});

// Read - gets all messages
app.get("/messages", function (request, response) {
  console.log(welcomeMessage);
  response.send(welcomeMessage);
});

// Read- messages with substring express -lv 3
app.get("/messages/search", function (request, response) {
  const searchTerm = request.query.term;
  const result = search(searchTerm, welcomeMessage);
  response.send(result);
});

function search(term, welcomeMessage) {
  console.log("hello");
  return welcomeMessage.filter((message) => message.text.includes(term));
}

// Read- most recent 10 messages -lv3
app.get("/messages/latest", function (request, response) {
  const latestMessage = latest(welcomeMessage);
  response.send(latestMessage);
  console.log(latestMessage);
});

function latest(arr) {
  return arr.slice(1).slice(-10);
}

// Read- the most recent 10 messages -lv 3
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

//update 
app.put("/messages/:id", (req, res) => {
  // partial or full
  const newMessage = req.body;
  const messageIndex = welcomeMessage.findIndex(
    (message) => message.id === parseInt(req.params.id) // string to number
  );
  console.log(messageIndex);
  if (messageIndex >= 0) {
    // we have found the number
    const origMessage = welcomeMessage[messageIndex]; //messageIndex is a number
    const updatedMessage = req.body; // incoming data
    // Data validation
    if (updatedMessage.id && origMessage.id !== updatedMessage.id) {
      // partial update
      res.status(400); // Bad request
      res.send({ message: "message IDs do not match" });
    } else if (origMessage.from !== updatedMessage.from) {
      res.status(401); // Not found
      res.send({
        message: "unauthorised access, can not change the from field!",
      });
    } else if (updatedMessage.timeSent) {
      res.status(401); // Not found
      res.send({
        message: "unauthorised access, can not change the time field!",
      });
    } else {
      welcomeMessage[messageIndex] = { ...origMessage, ...updatedMessage };
      fs.writeFileSync("./data.json", JSON.stringify(welcomeMessage), () => {});
      welcomeMessage.push(newMessage);
      res.sendStatus(201);
      res.send(welcomeMessage[messageIndex]);
    }
  } else if (messageIndex === NaN) {
    res.sendStatus(400);
  } else {
    res.status(404); // Not found
    res.send({ message: "no such id exists" });
  }
});

// Delete
app.delete("/messages/:id", (req, res) => {
  const messageIndex = welcomeMessage.findIndex(
    (message) => message.id == req.params.id
  );
  if (messageIndex >= 0) {
    welcomeMessage.splice(messageIndex, 1);
  }
  fs.writeFileSync("./data.json", JSON.stringify(welcomeMessage), () => {});
  res.status(204); // No data
  res.end(); // Response body is empty
});

const PORT = process.env.PORT||4003;
app.listen(PORT, () => console.log(`Your app is listening ...${PORT}`));
