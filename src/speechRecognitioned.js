import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SettingsVoiceRoundedIcon from '@mui/icons-material/SettingsVoiceRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import { Button, Container, Typography } from '@mui/material';


const SpeechRecognitioned = () => {
  // console.log(useSpeechRecognition);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <Container sx={{ display: "flex", flexDirection: "column", padding: "2%",justifyContent: "center", }}>

      <Typography style={{ textAlign: "center", fontSize: "2rem" }}>
        Speech Recognition
      </Typography>

      <p style={{ fontSize: "1.5rem", boxShadow: "1px 2px 19px #F4AAB9", height: "2rem", padding: "5%", textAlign: "center" , backgroundColor: "#fad9cd" }}>
        {transcript}
      </p>

      <div style={{ display: "flex", padding: "2%", justifyContent: "center" }}>

        {
          listening ? <SettingsVoiceRoundedIcon onClick={SpeechRecognition.stopListening} fontSize={'large'} />
            :
            <MicOffRoundedIcon onClick={SpeechRecognition.startListening} fontSize={'large'} />
        }

        <Button sx={{ marginLeft: "2%" }} variant='contained' style={{ fontSize: "0.9rem" }} onClick={resetTranscript}>
          clear
        </Button>

      </div>
    </Container>
  );
}

export default SpeechRecognitioned;
