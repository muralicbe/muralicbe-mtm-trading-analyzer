import { useState, useEffect } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Inject animation CSS once
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes fadeZoom {
        0% {
          opacity: 0;
          transform: scale(0.6);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setMessage("");
    setResult(null);
  };

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("chart", image);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setFilename(data.filename);
      setMessage("✅ Image uploaded successfully");
    }
  };

  const analyzeChart = async () => {
    if (!filename) {
      alert("Upload image first");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    const data = await res.json();
    setResult(data.aiResult);
    setLoading(false);
  };

  // ✅ SPLASH SCREEN (correct placement)
  if (showSplash) {
    return (
      <div style={styles.splash}>
        <img src="/icon.png" alt="MTM Logo" width={100} />
        <h2 style={{ color: "#ff0202", marginTop: 10 }}>MTM</h2>
        <p style={{ color: "#1faa12" }}>Trading Chart Analyzer</p>
      </div>
    );
  }

  // ✅ MAIN APP UI
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.mtm}>
            MTM
            <div style={styles.underline}></div>
          </div>
          <div style={styles.subtitle}>📊 Trading Chart Analyzer</div>
        </div>

        <input
          type="file"
          id="fileUpload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <label htmlFor="fileUpload" style={styles.chooseBtn}>
          📁 Choose Chart Image
        </label>

        {image && (
          <p style={{ fontSize: 12, marginTop: 6 }}>
            Selected: {image.name}
          </p>
        )}

        <div style={{ marginTop: 10 }}>
          <button style={styles.uploadBtn} onClick={uploadImage}>
            ⬆️ Upload Chart
          </button>
          <button style={styles.analyzeBtn} onClick={analyzeChart}>
            🤖 Analyze
          </button>
        </div>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {loading && <p>Analyzing… ⏳</p>}

        {result && (
          <div style={styles.result}>
            <h3>📈 MTM Trading Signal</h3>

            <p style={styles.signal}><b>Signal:</b> {result.signal}</p>
            <p style={styles.entry}><b>Entry:</b> {result.entry}</p>
            <p style={styles.sl}><b>Stop Loss:</b> {result.stopLoss}</p>
            <p style={styles.target}><b>Target:</b> {result.target}</p>
            <p style={styles.confidence}><b>Confidence:</b> {result.confidence}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1744782211816-c5224434614f?auto=format&fit=crop&w=1920&q=80")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:
      "'Inter', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },

  splash: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffffff",
    fontFamily:
      "'Inter', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },

  logoWrap: { textAlign: "center", marginBottom: 25 },

  mtm: {
    color: "#ff0202",
    fontSize: 42,
    fontWeight: 900,
    letterSpacing: 2,
    animation: "fadeZoom 1s ease-out",
  },

  underline: {
    width: 50,
    height: 4,
    backgroundColor: "#ff0202",
    margin: "6px auto 0",
    borderRadius: 2,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 700,
    color: "#1faa12",
    textShadow: "0 0 8px rgba(31,170,18,0.7)",
  },

  card: {
    background: "rgba(255, 255, 255, 0.75)",
    padding: 30,
    borderRadius: 12,
    width: "100%",
    maxWidth: 380,
    textAlign: "center",
  },

  chooseBtn: {
    display: "inline-block",
    padding: "12px 20px",
    marginTop: 10,
    background: "linear-gradient(135deg, #f19063, #ce630c)",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  uploadBtn: {
    padding: "10px 20px",
    marginRight: 10,
    background: "#ad06fa",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    minWidth: 140,
  },

  analyzeBtn: {
    padding: "10px 20px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    minWidth: 140,
  },

  result: {
    marginTop: 20,
    padding: 15,
    background: "#ffffff",
    borderRadius: 8,
    textAlign: "left",
  },

  signal: { color: "#16a34a", fontWeight: 700 },
  entry: { color: "#000", fontWeight: 600 },
  sl: { color: "#facc15", fontWeight: 600 },
  target: { color: "#dc2626", fontWeight: 700 },
  confidence: { color: "#111", opacity: 0.85 },
};

export default App;
