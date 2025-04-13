import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
console.log(__filename);


const app = express();
const PORT = 5000;
const DOWNLOAD_DIR = path.join(os.homedir(), "Downloads");
console.log("Download directory:", DOWNLOAD_DIR);

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

app.use(cors());
app.use(express.json());

app.post("/convert", (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "No URL provided" });
    }

    // const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${DOWNLOAD_DIR}/%(playlist_index)s - %(title)s.%(ext)s" "${url}"`;

    const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${path.join(DOWNLOAD_DIR, '%(playlist_index)s - %(title)s.%(ext)s')}" "${url}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(stderr);
            return res.status(500).json({ error: "Conversion failed" });
        }
        console.log(stdout);
        // Get list of downloaded MP3 files
        const files = fs.readdirSync(DOWNLOAD_DIR).filter(file => file.endsWith(".mp3"));
        const fileUrls = files.map(file => ({
            name: file,
            url: `http://localhost:${PORT}/downloads/${file}`,
        }));

        res.json({ files: fileUrls });
    });
});

app.use("/downloads", express.static(DOWNLOAD_DIR));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
