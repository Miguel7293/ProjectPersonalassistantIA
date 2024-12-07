# Planificación y Mejoras del Proyecto

---

## **Base de Datos**
- **Aleatoriedad y Naturalización:** Crear ID de usuario únicos (ejemplo: `#947192010`).

---

## **Módulos y Funcionalidades**

### **Crear Proyecto**
- Mejorar el diseño visual.
- Redireccionar automáticamente a la interfaz del proyecto tras su creación.
- Agregar opciones para:
  - Subir imagen (local o personalizada; a futuro, usar AWS como ejemplo).
  - Colaboración entre usuarios.
  - Búsqueda de colaboradores (por correo electrónico o ID).
  - Sistema de puntuación por día:
    - Modos: *Equilibrado, Personalizado, No asignar*.
    - **Nueva tabla en la base de datos.**
    - Limitar puntuación a menos de un millón.

---

### **Chat IA**
- **Mejorar diseño** para mayor orientación visual.
- Agregar:
  - Sugerencias de preguntas.
  - Interacción con la base de datos.
  - *Prompts* predefinidos para:
    - Crear proyectos.
    - Gestionar tareas.
  - Identificación del contexto (proyecto o tarea).
  - Generación automática del proyecto o tarea.
- **Futuro:**
  - Sugerencias estadísticas de rendimiento.
  - Recomendaciones generales.

---

### **Projects**
- **Días Restantes:** Visualizar con animaciones.
- **Tarjetas Animadas:** Cambiar a estadísticas tras 2 segundos (maqueta requerida).
- **Ordenar Proyectos:** Implementar `ORDER BY` con criterios:
  - Nombre.
  - Recientes.
  - Más cercanos a finalizar.
- **Edición:**
  - Iconos: Cambiar cadena `"string"` a `"url"`.
  - Manejo de fechas.
  - Gestión de colaboradores.

---

### **Gestión de Tareas**
#### **General**
- Rediseñar el calendario.
- Arreglar edición de tareas.
- Agregar botón de "Completado" con interfaz para marcar puntos terminados.
- Mostrar y permitir editar "Descripción" en creación y edición de tareas.
- Listar colaboradores al crear/editar tareas con:
  - Nombre.
  - Código (opcional).
  - Correo electrónico (opcional).
  - Tareas completadas.
  - Tareas pendientes.
- Agregar estadísticas al final.

#### **Crear Tarea**
- Asignación de tareas a colaboradores.
- Asignar puntos limitados al total del proyecto.
- Mejorar selección de fechas:
  - Restringir entre inicio y fin del proyecto.
- Descripción opcional para las tareas.

---

### **Historial de Notificaciones**
- Reemplazar el módulo de *Schedules* por **Notificaciones**:
  - Registrar eventos de proyectos (tareas completadas, miembros añadidos, etc.).
  - Agregar estado de lectura de notificaciones.

---

### **Dashboard**
- Crear un dashboard superior según la maqueta en Figma.
- Opciones:
  - **Cerrar Sesión.**
  - **Ajustar Cuenta:**
    - Editar imagen, contraseña, correo, nombre o eliminar cuenta.
- Saludo amigable de la IA con:
  - Últimas tareas pendientes.
