"use client";

import { useState } from "react";
import {
  Box,
  Slider,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import {
  bgmVolume,
  sfxVolume,
  setBgmVolume,
  setSfxVolume,
  globalVoice,
  availableVoices,
  setGlobalVoice,
  globalAudioEnabled,
  setGlobalAudioEnabled,
  globalStopBGMNarrate,
  setGlobalStopBGMNarrate,
  playRandomBGM,
  pauseBGM,
} from "@/utils/audio";

export default function AudioControls() {
  const [voice, setVoice] = useState(globalVoice); // Store voice in state
  const [audioEnabled, setAudioEnabled] = useState(globalAudioEnabled); // Default enabled
  const [stopBGM, setStopBGM] = useState(globalStopBGMNarrate); // Store stopBGM state
  const [bgm, setBgm] = useState(bgmVolume); // Store BGM volume in state
  const [sfx, setSfx] = useState(sfxVolume); // Store SFX volume in state

  const handleAudioToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudioEnabled(event.target.checked);
    setGlobalAudioEnabled(event.target.checked);
  };

  const handleBgmChange = (_: Event, value: number | number[]) => {
    const newValue = value as number;
    setBgm(newValue);
    setBgmVolume(newValue);
  };

  const handleSfxChange = (_: Event, value: number | number[]) => {
    const newValue = value as number;
    setSfx(newValue);
    setSfxVolume(newValue);
  };

  const handleStopBGMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStopBGM(event.target.checked);
    setGlobalStopBGMNarrate(event.target.checked);
  };

  const handleVoiceChange = (event: SelectChangeEvent<string>) => {
    const selectedVoice = event.target.value as string;
    setVoice(selectedVoice); // Updates local state
    setGlobalVoice(selectedVoice); // Updates global voice
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2, gap: 2 }}>
      <FormControlLabel
        control={
          <Checkbox checked={audioEnabled} onChange={handleAudioToggle} />
        }
        label="Audio"
      />

      <FormControlLabel
        control={<Checkbox checked={stopBGM} onChange={handleStopBGMChange} />}
        label="Stop BGM on Narration"
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>BGM Volume</Typography>
        <Slider
          value={bgm}
          min={0}
          max={1}
          step={0.0009}
          onChange={handleBgmChange}
          sx={{ width: 150 }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>SFX Volume</Typography>
        <Slider
          value={sfx}
          min={0}
          max={1}
          step={0.05}
          onChange={handleSfxChange}
          sx={{ width: 150 }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>Voice</Typography>
        <Select value={voice} onChange={handleVoiceChange} sx={{ width: 150 }}>
          {availableVoices.map((voiceOption) => (
            <MenuItem key={voiceOption} value={voiceOption}>
              {voiceOption}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Button variant="contained" color="primary" onClick={playRandomBGM}>
        Play BGM
      </Button>

      <Button variant="contained" color="primary" onClick={pauseBGM}>
        Pause BGM
      </Button>
    </Box>
  );
}
