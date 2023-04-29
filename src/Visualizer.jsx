import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography } from '@mui/material';

const Visualizer = () => {
  const canvasRef = useRef(null);
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const [analyserNode, setAnalyserNode] = useState(null);
  const [soundLevel, setSoundLevel] = useState(0);

  useEffect(() => {
    let mediaStream = null;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaStream = stream;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sourceNode = audioContext.createMediaStreamSource(mediaStream);
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        sourceNode.connect(analyserNode);
        setAnalyserNode(analyserNode);

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        setAudioData(dataArray);
    
        const draw = () => {
          requestAnimationFrame(draw);
          analyserNode.getByteFrequencyData(dataArray);
          const canvas = canvasRef.current;
          const height = canvas.height;
          const width = canvas.width;
          const barWidth = (width / bufferLength) * 2.5;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * height;
            sum += dataArray[i];
            ctx.fillStyle = `rgb(${barHeight}, 50, 50)`;
            ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
          }
          const avg = sum / bufferLength;
          setSoundLevel(avg);
        };
        draw();
      })
      .catch((err) => {
        console.error('Error getting user media', err);
      });
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);
  
  console.log(audioData);
  console.log(analyserNode);
  return (
    <div>
        <Typography style={{ textAlign: "center", fontSize: "1.5rem", padding: "2%" }}>
        Noise level
      </Typography>
        <Container sx={{ width: "76%" ,display: "Grid",padding: "2%", gridTemplateColumns:"30% 70%", background:"#A5DFD4",boxShadow: "1px 2px 19px #F4AAB9", border: "" }}>
        <div style={{padding: "3%", marginLeft: "20px", alignSelf: "center"}}>
        Sound level: {Math.trunc(soundLevel)}
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '92%', height: '100px', backgroundColor: '#000000' }}
      />

      <div style={{height: "20px",margin:"5%", backgroundColor: (Math.trunc(soundLevel)*5 < 160)? "black" : 'red' ,width:`${Math.trunc(soundLevel)*5}px`} }></div>

      <br />
     <div style={{display: 'flex' , alignItems: 'center',columnGap:'10px'}} >
       <div  style={{ borderRadius: '50%', backgroundColor: '#000000' ,width: "10px" ,height: '10px'  }}></div>
       Low Noise
      </div>
      <br />
      <div style={{display: 'flex' , alignItems: 'center',columnGap:'10px'}} >
       <div  style={{ borderRadius: '50%', backgroundColor: 'red' ,width: "10px" ,height: '10px'  }}></div>
       High Noise
      </div>
   </Container>
   
    </div>
  );
};

export default Visualizer;
