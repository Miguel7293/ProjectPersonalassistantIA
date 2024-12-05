const { GoogleGenerativeAI } = require("@google/generative-ai");

// Carga la clave de API desde las variables de entorno
const apiKey = process.env.GEMINI_API_KEY;

// Configura el cliente de Gemini
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Genera contenido usando la API de Gemini.
 * @param {string} prompt - El texto de entrada para la generación.
 * @returns {Promise<string>} - Respuesta generada por la IA.
 */
const generateContent = async (prompt) => {
  try {
    const response = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    // Aquí se recomienda inspeccionar la respuesta de la API:
    console.log(response); // Verifica la estructura exacta

    // Accede al texto generado de forma adecuada
    return response.text || response.data?.text || response?.response?.text || 'No se pudo generar una respuesta.'; // Ajusta según el formato real
  } catch (error) {
    console.error("Error al generar contenido:", error.message);
    throw new Error("Error al comunicarse con la API de Gemini");
  }
};

module.exports = { generateContent };
