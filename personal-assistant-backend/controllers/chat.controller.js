import { db } from '../database/connection.database.js';  // Asegúrate de tener la conexión configurada
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import { ProjectModel } from '../models/project.model.js';
import { UserProjectModel } from '../models/project.model.js';  // Usamos la lógica de UserProjectModel

// Inicializa la API con la clave desde variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Variable para almacenar el contexto de la conversación
let conversationHistory = [];

export const ChatController = {
  sendMessage: async (req, res) => {
    try {
      const { prompt, user_id } = req.body;  // Obtener user_id desde el cuerpo de la solicitud

      if (!prompt || !user_id) {
        console.log('Error: El prompt y el user_id son requeridos.');
        return res.status(400).json({ message: 'El prompt y el user_id son requeridos.' });
      }

      console.log('ID de usuario recibido:', user_id);
      
      
      const queryResult = await showUserProjectsAndTasks(user_id);  
      console.log('Resultados de las tareas del usuario:', queryResult);  // Para ver los datos


      // Construir el contexto desde el historial
      const context = conversationHistory.map((msg) => {
        return `Tú: ${msg.content}\nIA: ${msg.response}`;
      }).join("\n");

      // Agregar el nuevo mensaje al contexto
      const fullPrompt = `Esta es la conversación hasta ahora:\n${context}\n\nTú: ${prompt}\nIA: `;

      console.log('Prompt completo enviado a la IA:', fullPrompt);

      // Solicitar la respuesta de la IA con el historial completo
      const result = await model.generateContent({
        contents: [{ parts: [{ text: fullPrompt }] }]
      });

      const botResponse = result.response.text();

      if (!botResponse) {
        console.log('Error: La IA no respondió correctamente.');
        return res.status(400).json({ message: 'La IA no respondió correctamente.' });
      }

      console.log('Respuesta de la IA:', botResponse);

      // Intentar extraer el JSON del texto de la respuesta de la IA
      const jsonPart = extractJSON(botResponse.trim());

      if (jsonPart) {
        try {
          console.log('JSON encontrado:', jsonPart);

          const projectData = JSON.parse(jsonPart);

          // Verificar que los campos necesarios estén presentes
          if (projectData.startDate && projectData.endDate && projectData.title && projectData.description) {
            console.log('Proyecto recibido:', projectData);

            // Usar la lógica de creación de proyecto
            const createdProject = await ProjectModel.insert({
              Name: projectData.title,
              Start_Date: projectData.startDate,
              End_Date: projectData.endDate,
              Max_Points: projectData.maxPoints || 0,  // Si existe el campo Max_Points
              Image_URL: projectData.imageURL || 'Predeterminado',  // Imagen por defecto si no está presente
            });

            console.log('Proyecto creado con ID:', createdProject.project_id);

            // Llamar a la lógica de creación de la relación entre el usuario y el proyecto
            await createUserProjectRelationship(user_id, createdProject.project_id);

            // Guardar el nuevo mensaje y la respuesta en el historial
            conversationHistory.push({ content: prompt, response: botResponse });

            // Responder al cliente con el mensaje de éxito y los datos del proyecto en formato esquema
            const responseMessage = `
              ¡Genial! El proyecto ha sido creado con éxito.
            `;

            res.status(200).json({
              response: responseMessage,  // Mensaje con el esquema
            });
          } else {
            console.log('Error: El JSON no contiene los campos necesarios');
            return res.status(400).json({ message: 'El JSON no contiene los campos necesarios' });
          }
        } catch (error) {
          console.error('Error al procesar el JSON del proyecto:', error);
          return res.status(400).json({ message: 'Error al procesar el JSON del proyecto.' });
        }
      } else {
        console.log('Respuesta de la IA no contiene un JSON válido. Respondiendo normalmente...');

        // Si no es un JSON válido, respondemos con la IA normalmente
        conversationHistory.push({ content: prompt, response: botResponse });

        res.status(200).json({ response: botResponse });
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
  },
};

// Función para extraer el JSON del texto si lo contiene
function extractJSON(str) {
  // Buscar un JSON válido en el texto
  const jsonMatch = str.match(/\{.*\}/);
  if (jsonMatch && jsonMatch.length > 0) {
    return jsonMatch[0];  // Retorna el JSON encontrado
  }
  return null;  // No se encontró JSON válido
}

// Función para crear la relación entre el usuario y el proyecto
async function createUserProjectRelationship(user_id, project_id) {
  const userProjectData = {
    User_ID: user_id,
    Project_ID: project_id,
    Role: 'ADMIN',  // Asignamos el rol de "ADMIN" por defecto
    Assignment_Date: new Date().toISOString().split('T')[0],  // Fecha de asignación
  };

  // Usar el modelo UserProjectModel para insertar la relación
  await UserProjectModel.insert(userProjectData);
}


// Función para realizar la consulta y mostrar el resultado en el log
async function showUserProjectsAndTasks(user_id) {
  try {
    // Consulta para obtener los proyectos asignados al usuario
    const projectsResult = await db.query(`
      SELECT * FROM USER_PROJECT WHERE User_ID = $1;
    `, [user_id]);

    // Si no hay proyectos, devuelve un mensaje
    if (projectsResult.rows.length === 0) {
      console.log('No se encontraron proyectos para este usuario.');
      return;
    }

    // Variable para almacenar los proyectos y sus tareas
    const userProjectsWithTasks = [];

    // Crear un array de promesas para obtener las tareas de cada proyecto en paralelo
    const tasksPromises = projectsResult.rows.map(async (project) => {
      console.log('Proyecto:', project);  // Verifica que solo haya un proyecto por vez

      const project_id = project.project_id; // Acceso correcto a project_id
      if (!project_id) {
        console.log('Error: project_id no está disponible');
        return { Project: project, Tasks: [] };
      }

      // Verifica si ya se han consultado las tareas para este proyecto
      if (userProjectsWithTasks.some(p => p.Project.project_id === project_id)) {
        console.log(`Tareas ya recuperadas para el Project_ID: ${project_id}`);
        return; // No vuelve a hacer la consulta
      }

      console.log('Consultando tareas para Project_ID:', project_id);

      // Consulta para obtener las tareas asociadas al proyecto
      const tasksResult = await db.query(`
        SELECT * FROM TASK WHERE Project_ID = $1;
      `, [project_id]);

      console.log('Tareas recuperadas para Project_ID', project_id, tasksResult.rows);  // Verificación de las tareas

      return {
        Project: project,
        Tasks: tasksResult.rows
      };
    });

    // Ejecutar todas las promesas en paralelo
    const projectsWithTasks = await Promise.all(tasksPromises);

    // Filtrar proyectos sin tareas para evitar datos vacíos
    const filteredProjectsWithTasks = projectsWithTasks.filter(project => project !== undefined);

    // Devolver los proyectos con sus tareas
    return filteredProjectsWithTasks;
  } catch (error) {
    console.error('Error al ejecutar las consultas:', error);
  }
}
