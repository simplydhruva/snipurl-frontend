import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // ✅ URL validation
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 🎯 3D Tilt handlers
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: y * 10,
      y: x * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleShorten = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Invalid URL format");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://snipurl-backend.onrender.com/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
          customAlias: alias || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setShortUrl(data.shortUrl);
      setUrl("");
      setAlias("");
    } catch (err) {
      setError("Server not reachable");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* 🌌 PARTICLES */}
      <div className="particles">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            style={{
              left: Math.random() * 100 + "%",
              animationDuration: 5 + Math.random() * 10 + "s",
              animationDelay: Math.random() * 5 + "s",
            }}
          />
        ))}
      </div>

      {/* 🌌 Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-neonPurple opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px] float"></div>
      <div className="absolute w-[400px] h-[400px] bg-neonBlue opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px] float"></div>
      <div className="absolute w-[300px] h-[300px] bg-pink-500 opacity-10 blur-3xl rounded-full top-[30%] left-[60%] float"></div>

      <div className="w-full max-w-2xl text-center relative z-10 perspective-[1000px]">
        
        {/* CARD */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl transition-all duration-200 p-6 sm:p-10 mb-6"
        >
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
            <span className="text-neonPurple">Snip</span>
            <span className="text-neonBlue">URL</span>
          </h1>

          <p className="text-gray-400 mb-6">
            Trim your links. Amplify your reach.
          </p>

          {/* INPUTS */}
          <div className="flex flex-col gap-3">
            
            <input
              type="text"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neonPurple transition"
            />

            <input
              type="text"
              placeholder="Custom alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neonBlue transition"
            />

            <button
              onClick={handleShorten}
              className="px-6 py-3 rounded-xl btn-shine font-semibold hover:scale-105 active:scale-95 shadow-neon transition-all duration-200"
            >
              {loading ? "Snipping..." : "Snip It ✂️"}
            </button>

          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 mt-3 text-sm bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
              {error}
            </p>
          )}
        </div>

        {/* RESULT */}
        {shortUrl && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl hover:shadow-neon transition-all duration-300 p-6 animate-fadeIn space-y-4">
            
            <p className="text-gray-400 text-sm">Your shortened link:</p>

            <p className="text-green-400 text-sm">
              Your link is ready 🚀
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-neonBlue break-all font-medium"
              >
                {shortUrl}
              </a>

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg bg-neonPurple/20 border border-neonPurple hover:bg-neonPurple/40 transition"
              >
                Copy
              </button>

            </div>

            {/* QR CODE */}
            <div className="flex justify-center mt-4">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <QRCodeCanvas value={shortUrl} size={120} />
              </div>
            </div>

          </div>
        )}

        {/* TOAST */}
        {copied && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neonPurple px-6 py-2 rounded-full shadow-neon">
            Copied!
          </div>
        )}

      </div>
    </div>
  );
}

export default App;