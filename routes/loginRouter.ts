import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  const email = req.body.email;

  if (email.endsWith("@sitpune.edu.in")) {
    if (email.includes("btech")) {
      res.redirect("/student/dashboard");
    } else if (email.includes("coordinator")) {
      res.redirect("/coordinator/dashboard");
    } else if (email.includes("systemadmin")) {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/faculty/dashboard");
    }
  } else {
    res.redirect("/guest/dashboard");
  }
});

router.get("/auth/callback", (req, res) => {
  res.redirect("/");
});

module.exports = router;
