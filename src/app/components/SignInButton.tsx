"use client";

import { signIn } from "next-auth/react";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { playMenuSFX, playRandomBGM } from "@/utils/audio";

export default function SignInButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    playMenuSFX();
    playRandomBGM();
    setOpen(true);
  };

  const handleClose = () => {
    playMenuSFX();
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Sign In
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ textAlign: "center", backgroundColor: "transparent" }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "info.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                mt: 1,
                mb: 1,
                height: "40px",
                fontSize: "0.875rem",
              }}
              onClick={() => signIn("google")}
            >
              {<GoogleIcon />} Sign In with Google
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                mb: 1,
                height: "40px",
                fontSize: "0.875rem",
              }}
              onClick={() => signIn("discord")}
            >
              {<SportsEsportsIcon />} Sign In with Discord
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                mb: 1,
                height: "40px",
                fontSize: "0.875rem",
              }}
              onClick={() => signIn("linkedin")}
            >
              {<LinkedInIcon />} Sign In with LinkedIn
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="info">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
