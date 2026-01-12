import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  let reply = "Saya rekomendasikan Smart Watch AI";

  const text = message.toLowerCase();

  if (text.includes("sepatu")) {
    reply = "AI merekomendasikan: AI Sneakers (Best Seller)";
  } else if (text.includes("headphone")) {
    reply = "AI merekomendasikan: Wireless Headphone";
  } else if (text.includes("murah")) {
    reply = "AI merekomendasikan produk dengan harga terjangkau";
  }

  res.json({ reply });
});

app.listen(3000, () => {
  console.log("Backend AI running on port 3000");
});