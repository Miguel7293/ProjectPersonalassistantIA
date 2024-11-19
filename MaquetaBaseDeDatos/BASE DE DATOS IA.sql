
DROP DATABASE DB_IA_ASSITANT;

CREATE DATABASE DB_IA_ASSITANT;

CREATE TABLE USUARIO (
    ID_Usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(100) NOT NULL
);

CREATE TABLE PROYECTO (
    ID_Proyecto SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Fecha_Inicio DATE NOT NULL,
    Fecha_Fin DATE
);

CREATE TABLE TAREA (
    ID_Tarea SERIAL PRIMARY KEY,
    ID_Proyecto INT NOT NULL,
    Titulo VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Fecha_Inicio DATE NOT NULL,
    Fecha_Fin DATE,
    Fecha_Limite DATE,
    Estado VARCHAR(20),
    FOREIGN KEY (ID_Proyecto) REFERENCES PROYECTO (ID_Proyecto) ON DELETE CASCADE
);

CREATE TABLE NOTIFICACION (
    ID_Notificacion SERIAL PRIMARY KEY,
    ID_Proyecto INT NOT NULL,
    Contenido TEXT NOT NULL,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Leido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ID_Proyecto) REFERENCES PROYECTO (ID_Proyecto) ON DELETE CASCADE
);

CREATE TABLE USUARIO_PROYECTO (
    ID_Usuario INT NOT NULL,
    ID_Proyecto INT NOT NULL,
    Rol VARCHAR(50),
    Fecha_Asig DATE,
    PRIMARY KEY (ID_Usuario, ID_Proyecto),
    FOREIGN KEY (ID_Usuario) REFERENCES USUARIO (ID_Usuario) ON DELETE CASCADE,
    FOREIGN KEY (ID_Proyecto) REFERENCES PROYECTO (ID_Proyecto) ON DELETE CASCADE
);

CREATE TABLE USUARIO_NOTIFICACION (
    ID_Usuario INT NOT NULL,
    ID_Notificacion INT NOT NULL,
    Leido BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ID_Usuario, ID_Notificacion),
    FOREIGN KEY (ID_Usuario) REFERENCES USUARIO (ID_Usuario) ON DELETE CASCADE,
    FOREIGN KEY (ID_Notificacion) REFERENCES NOTIFICACION (ID_Notificacion) ON DELETE CASCADE
);

CREATE TABLE USUARIO_TAREA (
    ID_Usuario INT NOT NULL,
    ID_Tarea INT NOT NULL,
    Terminado BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ID_Usuario, ID_Tarea),
    FOREIGN KEY (ID_Usuario) REFERENCES USUARIO (ID_Usuario) ON DELETE CASCADE,
    FOREIGN KEY (ID_Tarea) REFERENCES TAREA (ID_Tarea) ON DELETE CASCADE
);




----DATOS PARA PROBAR EL LOG IN----

INSERT INTO USUARIO (Nombre, Correo, Contraseña) VALUES
('Juan Perez', 'juan.perez@email.com', 'password123'),
('Maria Garcia', 'maria.garcia@email.com', 'password123'),
('Carlos Lopez', 'carlos.lopez@email.com', 'password123'),
('Ana Martinez', 'ana.martinez@email.com', 'password123'),
('Pedro Fernandez', 'pedro.fernandez@email.com', 'password123'),
('Laura Rodriguez', 'laura.rodriguez@email.com', 'password123'),
('Luis Gonzalez', 'luis.gonzalez@email.com', 'password123'),
('Sofia Perez', 'sofia.perez@email.com', 'password123'),
('David Sanchez', 'david.sanchez@email.com', 'password123'),
('Eva Jimenez', 'eva.jimenez@email.com', 'password123'),
('Andres Torres', 'andres.torres@email.com', 'password123'),
('Clara Diaz', 'clara.diaz@email.com', 'password123'),
('Raul Vazquez', 'raul.vazquez@email.com', 'password123'),
('Sara Castro', 'sara.castro@email.com', 'password123'),
('Fernando Ruiz', 'fernando.ruiz@email.com', 'password123'),
('Isabel Morales', 'isabel.morales@email.com', 'password123'),
('Javier Romero', 'javier.romero@email.com', 'password123'),
('Lucia Hernandez', 'lucia.hernandez@email.com', 'password123'),
('Tomas Martin', 'tomas.martin@email.com', 'password123');


------- ELIMINAR TODAS LAS TABLAS --------
DO $$ 
DECLARE
    tabla RECORD;
BEGIN
    FOR tabla IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', tabla.tablename);
    END LOOP;
END $$;







CREATE TABLE USERS(
    User_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL
);

CREATE TABLE PROJECT (
    Project_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE
);

CREATE TABLE TASK (
    Task_ID SERIAL PRIMARY KEY,
    Project_ID INT NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Start_Date DATE NOT NULL,
    End_Date DATE,
    Due_Date DATE,
    Status VARCHAR(20),
    FOREIGN KEY (Project_ID) REFERENCES PROJECT (Project_ID) ON DELETE CASCADE
);

CREATE TABLE NOTIFICATION (
    Notification_ID SERIAL PRIMARY KEY,
    Project_ID INT NOT NULL,
    Content TEXT NOT NULL,
    Creation_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Project_ID) REFERENCES PROJECT (Project_ID) ON DELETE CASCADE
);

CREATE TABLE USER_PROJECT (
    User_ID INT NOT NULL,
    Project_ID INT NOT NULL,
    Role VARCHAR(50),
    Assignment_Date DATE,
    PRIMARY KEY (User_ID, Project_ID),
    FOREIGN KEY (User_ID) REFERENCES USERS (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Project_ID) REFERENCES PROJECT (Project_ID) ON DELETE CASCADE
);

CREATE TABLE USER_NOTIFICATION (
    User_ID INT NOT NULL,
    Notification_ID INT NOT NULL,
    Read BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (User_ID, Notification_ID),
    FOREIGN KEY (User_ID) REFERENCES USERS (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Notification_ID) REFERENCES NOTIFICATION (Notification_ID) ON DELETE CASCADE
);

CREATE TABLE USER_TASK (
    User_ID INT NOT NULL,
    Task_ID INT NOT NULL,
    Completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (User_ID, Task_ID),
    FOREIGN KEY (User_ID) REFERENCES USERS (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Task_ID) REFERENCES TASK (Task_ID) ON DELETE CASCADE
);
