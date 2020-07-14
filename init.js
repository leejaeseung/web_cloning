import app from "./app";
import "./db";

const PORT = 8000;

const handleListening = () => console.log('Example app listening on port ${PORT}!');

app.listen(PORT, handleListening);