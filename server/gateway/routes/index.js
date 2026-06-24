import express from 'express';
import axios from 'axios';

const router = express.Router();

//CHAT SERVICE ROUTES
router.use("/chat", async (req, res) => {
  try {
    const url = `${process.env.CHAT_SERVICE}/api/chat${req.originalUrl.replace("/api/chat", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Gateway error ❌" });
  }
});

//DIET SERVICE ROUTES
router.use("/diet", async (req, res) => {
  try {
    const url = `${process.env.DIET_SERVICE}/api/diet${req.originalUrl.replace("/api/diet", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Gateway error ❌" }
    );
  }
});

//WORK SERVICE ROUTES
router.use("/workouts", async (req, res) => {
  try {
    const url = `${process.env.WORKOUT_SERVICE}/api/workouts${req.originalUrl.replace("/api/workouts", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Gateway error ❌" });
  }
});

//STORE SERVICE ROUTES
router.use("/store", async (req, res) => {
  try {
    const url = `${process.env.STORE_SERVICE}/api/store${req.originalUrl.replace("/api/store", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Gateway error ❌" }
    );
  }
});

//STORE PRODUCTS ROUTES (FatSecret search)
router.use("/products", async (req, res) => {
  try {
    const url = `${process.env.STORE_SERVICE}/api/products${req.originalUrl.replace("/api/products", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Gateway error ❌" }
    );
  }
});


//FEED SERVICE ROUTES
router.use("/feed", async (req, res) => {
  try {
    const url = `${process.env.FEED_SERVICE}/api/feed${req.originalUrl.replace("/api/feed", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Gateway error ❌" }
    );
  }
});

//EXPLORE SERVICE ROUTES (Routed to Feed Service)
router.use("/explore", async (req, res) => {
  try {
    const url = `${process.env.FEED_SERVICE}/api/explore${req.originalUrl.replace("/api/explore", "")}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Gateway error ❌" }
    );
  }
});

// USER SERVICE ROUTES
router.use("/users", async (req, res) => {
  try {
    const url = `${process.env.USER_SERVICE}/api/users${req.originalUrl.replace("/api/users", "")}`;
    const contentType = req.headers["content-type"] || "";

    // For file uploads (multipart), we must forward the incoming stream (req) to axios
    // BUT for JSON (profile update), express.json() in server.js already consumed the stream,
    // so we must send req.body instead.
    const isMultipart = contentType.includes("multipart/form-data");

    const response = await axios({
      method: req.method,
      url,
      data: isMultipart ? req : req.body, 
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        Authorization: req.headers.authorization || "",
        "Content-Type": contentType,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("User Service Error via Gateway:", error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Gateway error ❌" }
    );
  }
});

//AUTH SERVICE ROUTES
router.use("/auth", async (req, res) => {
  try {
    // FULL CORRECT URL
    const url = `${process.env.AUTH_SERVICE}/api/auth${req.originalUrl.replace("/api/auth", "")}`;

    console.log("Forwarding to:", url); // debug log

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Gateway Error:", error.message);

    res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Gateway error ❌" }
    );
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "API Gateway is working!" });
});

export default router;