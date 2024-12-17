DO $$ 
DECLARE 
    func RECORD;
BEGIN
    FOR func IN 
        SELECT routine_schema, routine_name 
        FROM information_schema.routines 
        WHERE routine_type = 'FUNCTION' AND specific_schema NOT IN ('pg_catalog', 'information_schema')
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I CASCADE;', func.routine_schema, func.routine_name);
    END LOOP;
END $$;


DO $$ 
DECLARE 
    trg RECORD;
BEGIN
    FOR trg IN 
        SELECT event_object_schema, event_object_table, trigger_name 
        FROM information_schema.triggers
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I;', trg.trigger_name, trg.event_object_schema, trg.event_object_table);
    END LOOP;
END $$;

-- Función para notificaciones al INSERTAR en USER_PROJECT
CREATE OR REPLACE FUNCTION notify_user_project_insert()
RETURNS TRIGGER AS $$
DECLARE
    project_name VARCHAR(100);
    user_code CHAR(12); -- Variable para almacenar el unique_code
BEGIN
    -- Obtener el nombre del proyecto
    SELECT Name INTO project_name FROM PROJECT WHERE Project_ID = NEW.Project_ID;

    -- Obtener el unique_code del usuario
    SELECT unique_code INTO user_code FROM USERS WHERE User_ID = NEW.User_ID;

    -- Notificación según el rol asignado
    IF NEW.Role = 'ADMIN' THEN
        INSERT INTO NOTIFICATION (unique_code, Type, Content)
        VALUES (user_code, 'Project Created', 'Usted creó el proyecto ' || project_name || '.');
    ELSIF NEW.Role = 'COLLABORATOR' THEN
        INSERT INTO NOTIFICATION (unique_code, Type, Content)
        VALUES (user_code, 'Project Added', 'Usted fue agregado al proyecto ' || project_name || ' como colaborador.');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Disparador para insertar notificaciones en USER_PROJECT
CREATE TRIGGER trg_user_project_insert
AFTER INSERT ON USER_PROJECT
FOR EACH ROW
EXECUTE FUNCTION notify_user_project_insert();





-- Función para notificaciones al ACTUALIZAR en PROJECT
CREATE OR REPLACE FUNCTION notify_project_update()
RETURNS TRIGGER AS $$
DECLARE
    project_name VARCHAR(100) := '(Proyecto desconocido)'; -- Valor por defecto
    admin_code CHAR(12); -- Variable para almacenar el unique_code del admin
BEGIN
    -- Intentar obtener el nombre del proyecto
    SELECT Name INTO project_name 
    FROM PROJECT 
    WHERE Project_ID = NEW.Project_ID; -- Solo usamos NEW para la operación UPDATE

    -- Si el proyecto no existe, usar el valor por defecto
    IF project_name IS NULL THEN
        project_name := '(Proyecto desconocido)';
    END IF;

    -- Obtener el unique_code del administrador
    SELECT unique_code INTO admin_code
    FROM USER_PROJECT
    JOIN USERS ON USER_PROJECT.User_ID = USERS.User_ID
    WHERE USER_PROJECT.Project_ID = NEW.Project_ID
    AND ROLE = 'ADMIN'
    LIMIT 1;

    -- Si no se encuentra el unique_code del administrador, lanzamos un error
    IF admin_code IS NULL THEN
        RAISE EXCEPTION 'No se encontró un administrador para el proyecto % (UPDATE)', project_name;
    END IF;

    -- Crear notificación para la operación UPDATE
    INSERT INTO NOTIFICATION (unique_code, Type, Content)
    VALUES (admin_code, 'Project Updated', 'El proyecto "' || project_name || '" fue modificado.');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para notificaciones al ELIMINAR en PROJECT
CREATE OR REPLACE FUNCTION notify_project_delete()
RETURNS TRIGGER AS $$
DECLARE
    project_name VARCHAR(100) := '(Proyecto desconocido)'; -- Valor por defecto
    admin_code CHAR(12); -- Variable para almacenar el unique_code del admin
BEGIN
    -- Intentar obtener el nombre del proyecto
    SELECT Name INTO project_name 
    FROM PROJECT 
    WHERE Project_ID = OLD.Project_ID; -- Usamos OLD para la operación DELETE

    -- Si el proyecto no existe, usar el valor por defecto
    IF project_name IS NULL THEN
        project_name := '(Proyecto desconocido)';
    END IF;

    -- Obtener el unique_code del administrador
    SELECT unique_code INTO admin_code
    FROM USER_PROJECT
    JOIN USERS ON USER_PROJECT.User_ID = USERS.User_ID
    WHERE USER_PROJECT.Project_ID = OLD.Project_ID
    AND ROLE = 'ADMIN'
    LIMIT 1;

    -- Si no se encuentra el unique_code del administrador, lanzamos un error
    IF admin_code IS NULL THEN
        RAISE EXCEPTION 'No se encontró un administrador para el proyecto % (DELETE)', project_name;
    END IF;

    -- Crear notificación para la operación DELETE
    INSERT INTO NOTIFICATION (unique_code, Type, Content)
    VALUES (admin_code, 'Project Deleted', 'El proyecto "' || project_name || '" fue eliminado.');

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;



-- Disparador para notificaciones al ACTUALIZAR en PROJECT
CREATE TRIGGER trg_project_update
AFTER UPDATE ON PROJECT
FOR EACH ROW
EXECUTE FUNCTION notify_project_update();

-- Disparador para notificaciones al ELIMINAR en PROJECT
CREATE TRIGGER trg_project_delete
BEFORE DELETE ON PROJECT
FOR EACH ROW
EXECUTE FUNCTION notify_project_delete();



---///////////////////////////////////////////////////////////////TASKS////////////////////////////////////////////////////////


CREATE OR REPLACE FUNCTION notify_task_insert()
RETURNS TRIGGER AS $$
DECLARE
    task_title VARCHAR(100);
    project_name VARCHAR(100);
    admin_code CHAR(12);
BEGIN
    -- Obtener el título de la tarea y el nombre del proyecto
    SELECT Title INTO task_title FROM TASK WHERE Task_ID = NEW.Task_ID;
    SELECT Name INTO project_name FROM PROJECT WHERE Project_ID = NEW.Project_ID;

    -- Obtener el unique_code del administrador del proyecto
    SELECT unique_code INTO admin_code
    FROM USER_PROJECT
    JOIN USERS ON USER_PROJECT.User_ID = USERS.User_ID
    WHERE USER_PROJECT.Project_ID = NEW.Project_ID
    AND ROLE = 'ADMIN'
    LIMIT 1;

    -- Si no se encuentra el unique_code del administrador, lanzamos un error
    IF admin_code IS NULL THEN
        RAISE EXCEPTION 'No se encontró un administrador para el proyecto % (INSERT)', project_name;
    END IF;

    -- Crear notificación para la operación INSERT
    INSERT INTO NOTIFICATION (unique_code, Type, Content)
    VALUES (admin_code, 'Task Created', 'Se creó una nueva tarea "' || task_title || '" en el proyecto "' || project_name || '".');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION notify_task_update()
RETURNS TRIGGER AS $$
DECLARE
    task_title VARCHAR(100);
    project_name VARCHAR(100);
    admin_code CHAR(12);
BEGIN
    -- Obtener el título de la tarea y el nombre del proyecto
    SELECT Title INTO task_title FROM TASK WHERE Task_ID = NEW.Task_ID;
    SELECT Name INTO project_name FROM PROJECT WHERE Project_ID = NEW.Project_ID;

    -- Obtener el unique_code del administrador del proyecto
    SELECT unique_code INTO admin_code
    FROM USER_PROJECT
    JOIN USERS ON USER_PROJECT.User_ID = USERS.User_ID
    WHERE USER_PROJECT.Project_ID = NEW.Project_ID
    AND ROLE = 'ADMIN'
    LIMIT 1;

    -- Si no se encuentra el unique_code del administrador, lanzamos un error
    IF admin_code IS NULL THEN
        RAISE EXCEPTION 'No se encontró un administrador para el proyecto % (UPDATE)', project_name;
    END IF;

    -- Crear notificación para la operación UPDATE
    INSERT INTO NOTIFICATION (unique_code, Type, Content)
    VALUES (admin_code, 'Task Updated', 'La tarea "' || task_title || '" en el proyecto "' || project_name || '" fue modificada.');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION notify_task_delete()
RETURNS TRIGGER AS $$
DECLARE
    task_title VARCHAR(100);
    project_name VARCHAR(100);
    admin_code CHAR(12);
BEGIN
    -- Obtener el título de la tarea y el nombre del proyecto
    SELECT Title INTO task_title FROM TASK WHERE Task_ID = OLD.Task_ID;
    SELECT Name INTO project_name FROM PROJECT WHERE Project_ID = OLD.Project_ID;

    -- Obtener el unique_code del administrador del proyecto
    SELECT unique_code INTO admin_code
    FROM USER_PROJECT
    JOIN USERS ON USER_PROJECT.User_ID = USERS.User_ID
    WHERE USER_PROJECT.Project_ID = OLD.Project_ID
    AND ROLE = 'ADMIN'
    LIMIT 1;

    -- Si no se encuentra el unique_code del administrador, lanzamos un error
    IF admin_code IS NULL THEN
        RAISE EXCEPTION 'No se encontró un administrador para el proyecto % (DELETE)', project_name;
    END IF;

    -- Crear notificación para la operación DELETE
    INSERT INTO NOTIFICATION (unique_code, Type, Content)
    VALUES (admin_code, 'Task Deleted', 'La tarea "' || task_title || '" en el proyecto "' || project_name || '" fue eliminada.');

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;




CREATE TRIGGER trg_task_insert
AFTER INSERT ON TASK
FOR EACH ROW
EXECUTE FUNCTION notify_task_insert();


CREATE TRIGGER trg_task_update
AFTER UPDATE ON TASK
FOR EACH ROW
EXECUTE FUNCTION notify_task_update();


CREATE TRIGGER trg_task_delete
BEFORE DELETE ON TASK
FOR EACH ROW
EXECUTE FUNCTION notify_task_delete();



---------------------------------------------------------/////////////////////////////// 


CREATE OR REPLACE FUNCTION notify_task_assignment()
RETURNS TRIGGER AS $$
DECLARE
    task_title VARCHAR(100);
    project_name VARCHAR(100);
    assigned_user_code CHAR(12);
    admin_code CHAR(12);
BEGIN
    -- Obtener el título de la tarea y el nombre del proyecto
    SELECT Title INTO task_title FROM TASK WHERE Task_ID = NEW.Task_ID;
    SELECT Name INTO project_name FROM PROJECT WHERE Project_ID = (SELECT Project_ID FROM TASK WHERE Task_ID = NEW.Task_ID);

    -- Obtener el unique_code del usuario asignado
    SELECT unique_code INTO assigned_user_code
    FROM USERS
    WHERE User_ID = NEW.User_ID;

    -- Obtener el unique_code del administrador del proyecto
    SELECT unique_code INTO admin_code
    FROM USER_PROJECT
    JOIN USERS ON USER_PROJECT.User_ID = USERS.User_ID
    WHERE USER_PROJECT.Project_ID = (SELECT Project_ID FROM TASK WHERE Task_ID = NEW.Task_ID)
    AND ROLE = 'ADMIN'
    LIMIT 1;

    -- Si el usuario asignado es el administrador, no se genera notificación
    IF assigned_user_code = admin_code THEN
        RETURN NEW;
    END IF;

    -- Crear notificación para la asignación de tarea
    INSERT INTO NOTIFICATION (unique_code, Type, Content)
    VALUES (assigned_user_code, 'Task Assigned', 'Se le ha asignado la tarea "' || task_title || '" en el proyecto "' || project_name || '".');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_task_assignment
AFTER INSERT ON USER_TASK
FOR EACH ROW
EXECUTE FUNCTION notify_task_assignment();

----////////////////////////////// COMO ADMIN PARA SABER SI MIS COLABORADORES TERMINARON SU TAREA////////////////////////////  AUN NO PUESTA 

CREATE OR REPLACE FUNCTION notify_task_completion()
RETURNS TRIGGER AS $$
DECLARE
    task_title VARCHAR(100);
    project_name VARCHAR(100);
    user_email VARCHAR(100); -- Almacena el correo del usuario que completó la tarea
BEGIN
    -- Verificar si la tarea ha sido completada
    IF NEW.Completed = TRUE THEN
        -- Obtener el título de la tarea y el nombre del proyecto
        SELECT Title INTO task_title FROM TASK WHERE Task_ID = NEW.Task_ID;
        SELECT Name INTO project_name FROM PROJECT WHERE Project_ID = (SELECT Project_ID FROM TASK WHERE Task_ID = NEW.Task_ID);

        -- Obtener el correo electrónico del usuario que completó la tarea
        SELECT Email INTO user_email
        FROM USERS
        WHERE User_ID = NEW.User_ID;

        -- Crear notificación con el correo electrónico del usuario
        INSERT INTO NOTIFICATION (unique_code, Type, Content)
        VALUES (
            (SELECT unique_code FROM USERS WHERE User_ID = NEW.User_ID), 
            'Task Completed', 
            'El usuario con correo ' || user_email || ' completó la tarea "' || task_title || '" en el proyecto "' || project_name || '".'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trg_task_completion
AFTER UPDATE ON USER_TASK
FOR EACH ROW
WHEN (NEW.Completed = TRUE)  -- Solo ejecuta la función si se marca como completada
EXECUTE FUNCTION notify_task_completion();


