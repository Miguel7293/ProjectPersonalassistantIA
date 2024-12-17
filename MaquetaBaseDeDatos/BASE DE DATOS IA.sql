-- Eliminar la base de datos existente (si existe)
DROP DATABASE IF EXISTS DB_IA_ASSISTANT;

-- Crear la base de datos
CREATE DATABASE DB_IA_ASSISTANT;

-- Usar la nueva base de datos
\c DB_IA_ASSISTANT;

-- Eliminar todas las tablas existentes (asegurar reinicio limpio)
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

-- Tabla USERS
CREATE TABLE USERS (
    User_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Image_URL TEXT, -- URL para la imagen del usuario
    unique_code CHAR(12) UNIQUE NOT NULL DEFAULT CONCAT('USR', LPAD(CAST(nextval('users_user_id_seq') AS TEXT), 8, '0')) -- Código único generado
);

-- Tabla PROJECT
CREATE TABLE PROJECT (
    Project_ID SERIAL PRIMARY KEY,
    Name VARCHAR(100), -- Restricción de nombre único
    Start_Date DATE NOT NULL,
    End_Date DATE,
    Max_Points INT DEFAULT 0, -- Puntos máximos asignados
    Image_URL TEXT -- URL para la imagen del proyecto
);

-- Tabla ESTIMATED_POINTS
CREATE TABLE ESTIMATED_POINTS (
    Project_ID INT NOT NULL,
    Date DATE NOT NULL,
    Points INT,
    PRIMARY KEY (Project_ID, Date),
    FOREIGN KEY (Project_ID) REFERENCES PROJECT (Project_ID) ON DELETE CASCADE
);

-- Tabla TASK
CREATE TABLE TASK (
    Task_ID SERIAL PRIMARY KEY,
    Project_ID INT NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Start_Date DATE NOT NULL,
    End_Date DATE,
    Due_Date DATE,
    Status VARCHAR(20), -- PROGRESS | COMPLETED | NOT COMPLETED | NOT STARTED | NOT ASSIGNED
    Priority VARCHAR(20), -- LOW | MEDIUM | HIGH
    Assigned_Points INT DEFAULT 0, -- Puntos asignados
    FOREIGN KEY (Project_ID) REFERENCES PROJECT (Project_ID) ON DELETE CASCADE
);



CREATE TABLE PROGRESS_TASK (
    Task_ID INT NOT NULL,
    Date TIMESTAMP NOT NULL,  -- Cambié DATE a TIMESTAMP para incluir hora y minuto
    Points_Completed INT,
    PRIMARY KEY (Task_ID, Date),
    FOREIGN KEY (Task_ID) REFERENCES TASK (Task_ID) ON DELETE CASCADE
);


-- Tabla NOTIFICATION
CREATE TABLE NOTIFICATION (
    Notification_ID SERIAL PRIMARY KEY,
    unique_code CHAR(12) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    Content TEXT NOT NULL,
    Creation_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Read BOOLEAN DEFAULT FALSE
);



-- Tabla USER_PROJECT
CREATE TABLE USER_PROJECT (
    User_ID INT NOT NULL,
    Project_ID INT NOT NULL,
    Role VARCHAR(50), -- ADMIN | COLLABORATOR
    Assignment_Date DATE,
    PRIMARY KEY (User_ID, Project_ID),
    FOREIGN KEY (User_ID) REFERENCES USERS (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Project_ID) REFERENCES PROJECT (Project_ID) ON DELETE CASCADE
);


-- Tabla USER_TASK
CREATE TABLE USER_TASK (
    User_ID INT NOT NULL,
    Task_ID INT NOT NULL,
    Completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (User_ID, Task_ID),
    FOREIGN KEY (User_ID) REFERENCES USERS (User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Task_ID) REFERENCES TASK (Task_ID) ON DELETE CASCADE
);

