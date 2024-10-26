// ElevenLabTest.js
import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Container,
    Box,
    Typography,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Paper,
    IconButton,
    Alert,
} from '@mui/material';
import { PlayArrow, Stop, VolumeUp, Settings } from '@mui/icons-material';

const ElevenLabTest = () => {
    const [text, setText] = useState('');
    const [apiKey, setApiKey] = useState('sk_cfa00b39624fd4f551595e6927daef5d1e1fda1ad8919117');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [stability, setStability] = useState(0.5);
    const [similarity, setSimilarity] = useState(0.75);

    // Audio player reference
    const audioRef = React.useRef(new Audio());

    useEffect(() => {
        // Cleanup audio on component unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Fetch available voices when API key is set
    useEffect(() => {
        if (apiKey) {
            fetchVoices();
        }
    }, [apiKey]);

    const fetchVoices = async () => {
        try {
            const response = await fetch('https://api.elevenlabs.io/v1/voices', {
                headers: {
                    'xi-api-key': apiKey,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch voices');
            }

            const data = await response.json();
            setVoices(data.voices);
            if (data.voices.length > 0) {
                setSelectedVoice(data.voices[0].voice_id);
            }
        } catch (err) {
            setError('Error fetching voices: ' + err.message);
        }
    };

    const handleTextToSpeech = async () => {
        if (!text || !selectedVoice) {
            setError('Please enter text and select a voice');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
                {
                    method: 'POST',
                    headers: {
                        'xi-api-key': apiKey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text,
                        voice_settings: {
                            stability,
                            similarity_boost: similarity,
                        },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Text to speech conversion failed');
            }

            const audioBlob = await response.blob();
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);

            // Play the audio
            audioRef.current.src = url;
            audioRef.current.play();
        } catch (err) {
            setError('Error converting text to speech: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VolumeUp />
                    ElevenLabs Text to Speech
                </Typography>



                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Enter text to convert"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        margin="normal"
                        variant="outlined"
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Voice</InputLabel>
                        <Select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            label="Select Voice"
                        >
                            {voices.map((voice) => (
                                <MenuItem key={voice.voice_id} value={voice.voice_id}>
                                    {voice.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Stability: {stability}</Typography>
                    <Slider
                        value={stability}
                        onChange={(e, newValue) => setStability(newValue)}
                        min={0}
                        max={1}
                        step={0.1}
                        marks
                        valueLabelDisplay="auto"
                    />

                    <Typography gutterBottom sx={{ mt: 2 }}>
                        Similarity Boost: {similarity}
                    </Typography>
                    <Slider
                        value={similarity}
                        onChange={(e, newValue) => setSimilarity(newValue)}
                        min={0}
                        max={1}
                        step={0.1}
                        marks
                        valueLabelDisplay="auto"
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTextToSpeech}
                        disabled={loading || !apiKey || !text}
                        startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                    >
                        {loading ? 'Converting...' : 'Convert to Speech'}
                    </Button>

                    {audioUrl && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={stopAudio}
                            startIcon={<Stop />}
                        >
                            Stop Audio
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ElevenLabTest;