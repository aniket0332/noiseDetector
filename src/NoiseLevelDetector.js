import React, { useState, useEffect, useRef } from "react";
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';


const NoiseLeveldDetector = () => {
    const canvasRef = useRef(null);
    const [analyser, setAnalyser] = useState(null);
    const [audioCtx, setAudioCtx] = useState(null);
    const [dataArray, setDataArray] = useState(new Uint8Array(0));

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        const animate = () => {
            requestAnimationFrame(animate);

            if (analyser && audioCtx) {
                analyser.getByteTimeDomainData(dataArray);
                ctx.clearRect(0, 0, width, height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#000";
                ctx.beginPath();

                const sliceWidth = (width * 1.0) / dataArray.length;
                let x = 0;

                for (let i = 0; i < dataArray.length; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * height) / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            }
        };

        animate();
    }, [analyser, audioCtx, dataArray]);

    const handleStart = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

        setAudioCtx(audioContext);
        setAnalyser(analyserNode);
        setDataArray(dataArray);

        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyserNode);
                analyserNode.connect(audioContext.destination);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleStop = () => {
        if (audioCtx) {
            audioCtx.close();
            setAudioCtx(null);
            setAnalyser(null);
            setDataArray(new Uint8Array(0));
        }
    };

    const [button, setbutton] = useState(false);

    const toggle = () => {
        if (!button) {
            handleStart();
            setbutton(true);
        }
        else {
            handleStop();
            setbutton(false);
        }
    }

    return (

        <>
            <Box sx={{ flexGrow: 1 }} >
                <AppBar position="static" style={{backgroundColor: "#573c3f"}} >
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Noise detector
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Container sx={{ display: "flex", flexDirection: "column", padding: "2%" }}>
                <canvas ref={canvasRef} width={1000} height={200} style={{backgroundColor: "#fad9cd", border: "1px solid black"}}></canvas>
                <div style={{ marginLeft: "auto", marginRight: "auto", width: "32px", padding: "2%" }}>
                    {button ? (
                            <PauseCircleIcon color='success' onClick={toggle} fontSize={'large'}/>
                    ) : (
                            <PlayCircleIcon color='success' onClick={toggle} fontSize={'large'}/>
                    )}

                </div>
            </Container>

        </>
    );
};

export default NoiseLeveldDetector;
