const http = require("http");
const fs = require("fs");
const path = require("path");

// Path to the data file
const DATA_FILE = path.join(__dirname, "data.json");

// Helper function to serve static files
function serveStaticFile(res, filePath, contentType) {
    console.log(`Serving file: ${filePath}`);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error(`Error serving file ${filePath}:`, err);
            res.writeHead(500);
            res.end("Server Error");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
}

// Create the server
const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);

    if (req.method === "GET") {
        if (req.url === "/" || req.url === "/home.html") {
            serveStaticFile(res, path.join(__dirname, "home.html"), "text/html");
        } else if (req.url === "/index.html") {
            serveStaticFile(res, path.join(__dirname, "index.html"), "text/html");
        } else if (req.url === "/home.css") {
            serveStaticFile(res, path.join(__dirname, "css", "home.css"), "text/css"); // Updated path
        } else if (req.url === "/style.css") {
            serveStaticFile(res, path.join(__dirname, "css", "style.css"), "text/css"); // Updated path
        } else if (req.url === "/script.js") {
            serveStaticFile(res, path.join(__dirname, "script.js"), "application/javascript");
        } else if (req.url === "/users") {
            fs.readFile(DATA_FILE, (err, data) => {
                if (err) {
                    console.error("Error reading data file:", err);
                    res.writeHead(500);
                    res.end("Error reading data file");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data || "[]");
                }
            });
        } else if (req.url === "/homepage-data") {
            const homepageData = {
                message: "Welcome to Brighty Nerd!",
                courses: ["Web Design", "Graphic Design", "SEO Marketing"],
            };
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(homepageData));
        } else if (req.url.startsWith("/images/")) {
            // Serve images from the 'images' directory
            const imagePath = path.join(__dirname, req.url);
            serveStaticFile(res, imagePath, "image/png");
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    } else if (req.method === "POST" && req.url === "/users") {
        console.log("Received POST request for /users");

        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const userData = JSON.parse(body);
                console.log("User data received:", userData);

                fs.readFile(DATA_FILE, (err, data) => {
                    const users = data ? JSON.parse(data) : [];
                    users.push(userData);

                    fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
                        if (err) {
                            console.error("Error saving data:", err);
                            res.writeHead(500);
                            res.end("Error saving data");
                        } else {
                            res.writeHead(200, { "Content-Type": "text/plain" });
                            res.end("Data saved successfully");
                        }
                    });
                });
            } catch (e) {
                console.error("Error parsing request body:", e);
                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });
    } else {
        res.writeHead(405);
        res.end("Method Not Allowed");
    }
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
