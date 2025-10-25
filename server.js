const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path"); // ✅ required for serving static files

const app = express();
const port = 4000;

// ✅ Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MySQL connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",                // your MySQL username
  password: "sALMA123000@",    // your actual password
  database: "dokhospital",     // your database name
});

// ✅ Connect to the MySQL server
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// 🩺 POST: Save new appointment
app.post("/submit", (req, res) => {
  const {
    id,
    Name,
    Phone_number,
    email,
    age,
    tutor_phone_if_minor,
    tutor_name,
    date,
    treatment_type,
    comment,
  } = req.body;

  const sql = `
    INSERT INTO appointments 
    (id, Name, Phone_number, email, age, tutor_phone_if_minor, tutor_name, date, treatment_type, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      id,
      Name,
      Phone_number,
      email,
      age,
      tutor_phone_if_minor,
      tutor_name,
      date,
      treatment_type,
      comment,
    ],
    (err) => {
      if (err) {
        console.error("❌ Error saving appointment:", err);
        return res.send("<h3>Error saving appointment</h3>");
      }
      res.send("<h3>✅ Appointment saved successfully!</h3><a href='/appointments'>View all</a>");
    }
  );
});

// 📋 GET: Display all appointments
app.get("/appointments", (req, res) => {
  db.query("SELECT * FROM appointments", (err, results) => {
    if (err) {
      console.error("❌ Error fetching appointments:", err);
      return res.send("<h3>Error loading appointments</h3>");
    }

    let html =
      "<h2>All Appointments</h2><table border='1' cellpadding='5'><tr>" +
      "<th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Age</th><th>Tutor Phone</th><th>Tutor Name</th><th>Date</th><th>Treatment</th><th>Comment</th></tr>";

    results.forEach((r) => {
      html += `<tr>
        <td>${r.id}</td>
        <td>${r.Name}</td>
        <td>${r.Phone_number}</td>
        <td>${r.email}</td>
        <td>${r.age}</td>
        <td>${r.tutor_phone_if_minor}</td>
        <td>${r.tutor_name}</td>
        <td>${r.date ? r.date.toISOString().split("T")[0] : ""}</td>
        <td>${r.treatment_type}</td>
        <td>${r.comment}</td>
      </tr>`;
    });

    html += "</table><br><a href='/'>Back</a>";
    res.send(html);
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});


