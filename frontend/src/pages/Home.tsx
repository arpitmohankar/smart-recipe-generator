/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Restaurant as RestaurantIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

import ImageUpload from '../components/ImageUpload';
import FilterSection from '../components/FilterSection';
import RecipeCard from '../components/RecipeCard';

import { chatAPI, imageAPI } from '../services/api';
import type { Message } from '../services/api';

const Home = () => {
  const [chatId, setChatId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [identifiedIngredients, setIdentifiedIngredients] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const [preferences, setPreferences] = useState({
    dietary: [],
    cuisine: '',
    difficulty: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    const init = async () => {
      try {
        const id = await chatAPI.createChat();
        setChatId(id);
      } catch (err) {
        console.error("Chat creation error:", err);
      }
    };
    init();
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (files: File[]) => {
    setSelectedImages(files);
  };

  const handleImageAnalyze = async () => {
  if (selectedImages.length === 0) return;

  setIsLoading(true);
  try {
    const ingredients = await imageAPI.analyzeImages(selectedImages);

    console.log("Image ingredients:", ingredients);

    setIdentifiedIngredients(ingredients);  // SAVE GLOBAL

    // 1️⃣ Create chat message now
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Ingredients found: ${ingredients.join(", ")}`,
      ingredients,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // 2️⃣ Send to backend IMMEDIATELY
    const response = await chatAPI.sendMessage(
      chatId,
      userMessage.content,
      ingredients,
      preferences
    );

    setMessages(prev => [...prev, response]);

    setSelectedImages([]);
    setShowImageUpload(false);

  } catch (error) {
    console.error("Error analyzing images:", error);
  } finally {
    setIsLoading(false);
  }
};


  const handleSendMessage = async () => {
    if (!inputMessage.trim() && identifiedIngredients.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage || "Suggest recipes for these ingredients",
      ingredients: identifiedIngredients,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    setIsLoading(true);

    try {
      const reply = await chatAPI.sendMessage(chatId, userMessage.content, identifiedIngredients, preferences);
      setMessages(prev => [...prev, reply]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ borderBottom: 1, p: 2, bgcolor: "background.paper" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <RestaurantIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6">Smart Recipe Generator</Typography>
        </Stack>
      </Box>

      {/* Main */}
      <Container maxWidth="md" sx={{ flex: 1, overflow: "hidden", py: 2 }}>
        <Stack spacing={2} sx={{ height: "100%" }}>
          
          <FilterSection preferences={preferences} onPreferencesChange={setPreferences} />

          {/* Chat Area */}
          <Paper sx={{ flex: 1, p: 2, overflowY: "auto" }}>
            <Stack spacing={2}>
              {messages.map(msg => (
                <Box key={msg.id} sx={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <Paper sx={{ p: 2, bgcolor: msg.role === "user" ? "primary.main" : "background.paper" }}>
                    <Typography>{msg.content}</Typography>
                  </Paper>
                </Box>
              ))}

              {isLoading && <CircularProgress sx={{ alignSelf: "flex-start" }} />}

              <div ref={messagesEndRef}></div>
            </Stack>
          </Paper>

          {/* Image Upload */}
          {showImageUpload && (
            <ImageUpload
              onImagesSelect={handleImageSelect}
              onAnalyze={handleImageAnalyze}
              selectedImages={selectedImages}
              isLoading={isLoading}
            />
          )}

          {/* Input box */}
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => setShowImageUpload(!showImageUpload)}>
                <AttachFileIcon />
              </IconButton>

              <TextField
                fullWidth
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe your ingredients..."
                multiline
              />

              <IconButton onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                <SendIcon />
              </IconButton>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
