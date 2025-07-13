import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Paths
const CLIENT_BUILD_PATH = path.join(__dirname, "../client/dist");
app.use(express.static(CLIENT_BUILD_PATH));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
// });
const DOWNLOAD_DIR = path.join(os.homedir(), "Downloads");

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/downloads", express.static(DOWNLOAD_DIR));

// Routes
app.post("/convert", (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "No URL provided" });

    // Step 1: List files before download
    const beforeFiles = new Set(fs.readdirSync(DOWNLOAD_DIR));

    const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${path.join(DOWNLOAD_DIR, '%(playlist_index)s - %(title)s.%(ext)s')}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(stderr);
            return res.status(500).json({ error: "Conversion failed" });
        }

        // Step 2: List files after download
        const afterFiles = fs.readdirSync(DOWNLOAD_DIR);
        const newFiles = afterFiles.filter(file => file.endsWith(".mp3") && !beforeFiles.has(file));

        const fileUrls = newFiles.map(file => ({
            name: file,
            url: `/downloads/${file}`,
        }));

        res.json({ files: fileUrls });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
