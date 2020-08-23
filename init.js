import app from "./app";
import "./db";

const handleListening = () => console.log("Example app listening on port " + process.env.PORT + "!");

console.log("hi")

app.listen(process.env.PORT, handleListening);