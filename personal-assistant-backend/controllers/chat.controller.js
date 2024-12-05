import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Inicializa la API con la clave desde variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Variable para almacenar el contexto de la conversación
let conversationHistory = [];

export const ChatController = {
  sendMessage: async (req, res) => {
    try {
      const { prompt } = req.body; // Recibimos el mensaje del cliente

      if (!prompt) {
        return res.status(400).json({ message: 'El prompt es requerido.' });
      }

      // Construir el contexto desde el historial
      const context = conversationHistory.map((msg) => {
        return `Tú: ${msg.content}\nIA: ${msg.response}`;
      }).join("\n");

      // Agregar el nuevo mensaje al contexto
      const fullPrompt = `Esta es la conversación hasta ahora:\n${context}\n\nTú: ${prompt}\nIA: `;

      // Solicitar la respuesta de la IA con el historial completo
      const result = await model.generateContent({
        contents: [{ parts: [{ text: fullPrompt }] }]
      });

      const botResponse = result.response.text();

      // Guardar el nuevo mensaje y la respuesta en el historial
      conversationHistory.push({ content: prompt, response: botResponse });

      // Responder al cliente
      res.status(200).json({ response: botResponse });
    } catch (error) {
      console.error('Error al comunicarse con la API de Gemini:', error);
      res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
  },
};
