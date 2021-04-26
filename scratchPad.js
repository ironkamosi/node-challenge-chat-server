app.post("/messages", (req, res) => {
  const message = req.body;
  if (message.from == "" || message.from == undefined) {
    res.sendStatus(400);
  } else if (message.text == "" || message.text == undefined) {
    res.sendStatus(400);
  } else {
    newChats.push(message);
  }
  fs.writeFileSync("./file.json", JSON.stringify(newChats), () => {});
  res.send(message);
});




//Create

app.post("/messages", (req, res) => {
  const newMessage = req.body;
  try {
    //file written successfully
    if (welcomeMessage.find((element) => element.id == newMessage.id)) {
      // make sure id does not exist
      res.status(400);
      res.send({ message: "invalid id already exist" });
    } else if (!newMessage.id || !newMessage.from || !newMessage.text) {
      res.status(400); // level 2
      res.send({ message: "bad data" });
    } else {
      welcomeMessage.push(newMessage);
      res.status(201);
      fs.writeFileSync("./data.json", JSON.stringify(newMessage), () => {}); // Json function method
      res.send(newMessage);
    }
  } catch (err) {
    console.error(err);
  }
});
