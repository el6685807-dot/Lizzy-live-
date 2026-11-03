
const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LIZZY LIVE Agora Token Server is running 💜");
});

app.get("/rtc/:channel/:uid", (req, res) => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    return res.status(500).json({ error: "Agora credentials missing" });
  }

  const channel = req.params.channel;
  const uid = Number(req.params.uid);

  if (!channel || !Number.isInteger(uid) || uid < 0) {
    return res.status(400).json({ error: "Invalid channel or UID" });
  }

  const role = RtcRole.PUBLISHER;
  const expiration = Math.floor(Date.now() / 1000) + 3600;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    uid,
    role,
    expiration
  );

  res.json({ token, appId, channel, uid });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("LIZZY LIVE server running on " + port));
