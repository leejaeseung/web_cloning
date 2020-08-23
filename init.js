import app from "./app";
import "./db";

const handleListening = () => console.log("Example app listening on port " + process.env.PORT + "!");

app.listen(process.env.PORT, handleListening);