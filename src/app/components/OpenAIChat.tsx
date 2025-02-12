"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import { useAudio } from "@/context/AudioProvider";
import Torch from "../three/Torch";

interface Message {
  role: string;
  content: string;
}

export default function OpenAIChat() {
  const { data: session } = useSession();
  const { menuSelect } = useAudio();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionPoints, setActionPoints] = useState<number | null>(null);
  const messages = useRef<Message[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (session) {
      fetchActionPoints();
      fetchMessages();
    }
  }, [session]);

  const fetchActionPoints = async () => {
    try {
      const res = await fetch("/api/action-points");
      if (!res.ok) throw new Error("Failed to fetch action points");

      const data = await res.json();
      setActionPoints(data.actionPoints);
    } catch (error) {
      console.error("Error fetching action points:", error);
      setActionPoints(0);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/v1/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data: Message[] = await res.json();
      messages.current = data;

      const lastAssistantMessage = data
        .reverse()
        .find((msg) => msg.role === "assistant");
      if (lastAssistantMessage) setResponse(lastAssistantMessage.content);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const handleSubmit = async () => {
    menuSelect();
    if (!input.trim()) return;
    if (actionPoints === null || actionPoints <= 0) {
      setResponse("⚠️ Not enough Action Points to perform this action.");
      return;
    }

    stopAudio();
    setInput("");
    setResponse("🛡️ Action Point Used 🗡️  " + input);
    setLoading(true);

    // **Immediately decrement AP locally for UI responsiveness**
    setActionPoints((prev) => (prev !== null ? prev - 1 : 0));

    try {
      const res = await fetch("/api/v1/openaiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, messages: messages.current }),
      });

      const data = await res.json();
      if (res.status !== 200) {
        setResponse(data.error || "Error processing request");
        return;
      }

      messages.current.push({ role: "user", content: input });
      messages.current.push({ role: "assistant", content: data.reply });

      await playTTS(data.reply);

      setResponse(data.reply || "No response received");

      // **Re-fetch AP from the database**
      fetchActionPoints();
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error processing request");
    }

    setLoading(false);
  };

  const playTTS = async (text: string) => {
    try {
      const ttsRes = await fetch("/api/v1/openaiTTS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (!ttsRes.ok) throw new Error("Failed to fetch TTS audio");

      const reader = ttsRes.body?.getReader();
      if (!reader) throw new Error("Failed to read TTS stream");

      const audioChunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        audioChunks.push(value);
      }

      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);

      stopAudio();
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      audio.play();
      audioRef.current = audio;
    } catch (error) {
      console.error("Error playing TTS:", error);
    }
  };

  return (
    <Box sx={{ textAlign: "center", padding: 2 }}>
      <Box>
        <Torch />
      </Box>
      <TextField
        label="Enter your command..."
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        sx={{ marginBottom: 2, width: "50%" }}
        onKeyUp={(e) => e.key === "Enter" && handleSubmit()}
        disabled={loading} // Disable input while loading
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || actionPoints === 0}
              >
                {loading
                  ? "Loading..."
                  : `Action Points: ${actionPoints ?? "..."}`}
              </Button>
            </InputAdornment>
          ),
        }}
      />

      {response && (
        <Box
          sx={{
            marginTop: 2,
            textAlign: "left",
            padding: 2,
            width: "72vw",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#1e1e1e",
            color: "#fff",
            margin: "0 auto",
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}></Typography>
          <ReactMarkdown>{response}</ReactMarkdown>
        </Box>
      )}
    </Box>
  );
}
