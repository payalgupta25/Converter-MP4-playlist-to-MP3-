import { useState } from "react";
import axios from "axios";

function App() {
    const [url, setUrl] = useState("");
    const [mp3Files, setMp3Files] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const handleConvert = async () => {
        setMp3Files([]);
        setDownloaded(false);
        setIsLoading(true);

        try {
            const response = await axios.post("/convert", { url });
            setMp3Files(response.data.files);
            setDownloaded(true);
        } catch (error) {
            console.error("Conversion failed:", error);
            alert("Conversion failed! Please check the URL.");
        } finally {
            setIsLoading(false);
            setUrl("");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>
                    <span style={{ color: "red" }}>YouTube</span> Playlist to MP3
                </h2>

                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter Playlist URL"
                    style={styles.input}
                />
                <button
                    onClick={handleConvert}
                    style={{
                        ...styles.button,
                        opacity: isLoading ? 0.7 : 1,
                        cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? "🔄 Converting..." : "🎵 Convert"}
                </button>

                {isLoading && <p style={styles.status}>⏳ Downloading MP3s...</p>}
                {downloaded && !isLoading && <p style={styles.success}>✅ All songs downloaded</p>}

                {mp3Files.length > 0 && (
                    <div style={styles.results}>
                        <h3 style={styles.downloadHeading}>Playlist</h3>
                        <ul style={styles.list}>
                            {mp3Files.map((file, index) => (
                                <li key={index} style={styles.listItem}>
                                    <a href={file.url} download style={styles.link}>
                                        ⬇️ {file.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
        
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f7f7f7, #dfe9f3)",
        padding: "20px"
    },
    card: {
        backgroundColor: "#fff",
        padding: "30px 20px",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "500px",
        textAlign: "center",
    },
    heading: {
        fontSize: "1.8rem",
        marginBottom: "20px",
        fontFamily: "Segoe UI, sans-serif",
    },
    input: {
        padding: "12px",
        width: "90%",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        marginBottom: "10px",
    },
    button: {
        padding: "12px 20px",
        backgroundColor: "#ff4d4d",
        color: "#fff",
        fontSize: "1rem",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "10px",
    },
    results: {
        marginTop: "30px",
    },
    downloadHeading: {
        fontSize: "1.2rem",
        marginBottom: "10px",
    },
    list: {
        listStyleType: "none",
        padding: 0,
    },
    listItem: {
        marginBottom: "10px",
    },
    link: {
        color: "#1a73e8",
        textDecoration: "none",
        fontWeight: "500",
    },
    status: {
        marginTop: "15px",
        color: "#555",
        fontStyle: "italic",
    },
    success: {
        marginTop: "15px",
        color: "green",
        fontWeight: "bold",
    }
};

export default App;
