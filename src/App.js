import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import './App.css';
import NoiseLevelDetector from './NoiseLevelDetector';
import Visualizer from './Visualizer';
import SpeechRecognitioned from './speechRecognitioned';

function App() {
 
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
    <Visualizer/>
    <NoiseLevelDetector/>
    <SpeechRecognitioned/>
    </>
  );
}

export default App;

