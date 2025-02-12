"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAudio } from "@/context/AudioProvider";
import Torch from "../three/Torch";

// Explicitly define types for `code` component props
interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const labels = [
  "What will you do...",
  "Your Journey Begins...",
  "Enter your command...",
  "What is your next move...",
  "Type your action...",
  "What's next...",
  "What will you do next...",
  "Enter your next command...",
  "Make a choice...",
  "The choice is yours...",
  "Decide your fate...",
  "Create your destiny...",
  "Choose your path...",
  "Select your action...",
  "Decide your own fate...",
];

export default function OpenAIChat() {
  const { menuSelect } = useAudio();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState(labels[0]);
  const messages = useRef<{ role: string; content: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Store current audio instance

  useEffect(() => {
    setLabel(labels[Math.floor(Math.random() * labels.length)]);
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset audio position
      audioRef.current = null;
    }
  };

  const handleSubmit = async () => {
    menuSelect();
    setLabel(labels[Math.floor(Math.random() * labels.length)]);
    if (!input.trim()) return;
    stopAudio(); // Stop any currently playing audio
    setResponse("");
    setLoading(true);

    try {
      // Fetch OpenAI Chat Response
      const res = await fetch("/api/v1/openaiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, messages: messages.current }),
      });

      const data = await res.json();
      messages.current.push({ role: "user", content: input });
      messages.current.push({ role: "assistant", content: data.reply });

      // Fetch TTS Stream
      const ttsRes = await fetch("/api/v1/openaiTTS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: data.reply }),
      });

      if (!ttsRes.ok) {
        throw new Error("Failed to fetch TTS audio");
      }

      // Create a stream and play audio while loading
      const reader = ttsRes.body?.getReader();

      if (!reader) {
        throw new Error("Failed to read TTS stream");
      }

      const audioChunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        audioChunks.push(value);
      }

      // Convert stream chunks to audio buffer
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the streamed audio
      const audio = new Audio(audioUrl);
      audio.play();
      audioRef.current = audio; // Store the audio instance

      // Display the response
      setResponse(data.reply || "No response received");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error processing request");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ textAlign: "center", padding: 2 }}>
      <Box>
        <Torch />
      </Box>
      <TextField
        label={label}
        variant="outlined"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        sx={{ marginBottom: 2, width: "50%" }}
        onKeyUp={(e) => e.key === "Enter" && handleSubmit()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Take Action"}
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
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#1e1e1e",
            color: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}></Typography>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).trim()}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {response}
          </ReactMarkdown>
        </Box>
      )}
    </Box>
  );
}
