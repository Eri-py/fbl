import express from "express";
import cors from "cors";

const app = express();
const port = 5000;

const corsOptions = {
  origin: "http://localhost:5173",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
