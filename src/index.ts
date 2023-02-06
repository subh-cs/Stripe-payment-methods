import express from "express";
// require("dotenv").config();
const app = express();
app.use(express.json());

app.use("/", require("./router"));

app.listen(process.env.PORT, (): void => {
  console.log(`Server started on port ${process.env.PORT}`);
});
