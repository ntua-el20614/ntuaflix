SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Step 2: Recreate the 'users' table
CREATE TABLE users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    is_admin BOOLEAN DEFAULT FALSE,
    username VARCHAR(255) UNIQUE,
    approved BOOLEAN,
    password_hashed VARCHAR(255)
);
ALTER TABLE users AUTO_INCREMENT = 1;

select * from users;

INSERT INTO users (is_admin, username, approved, password_hashed) VALUES ('1','chris','1' ,'$2a$10$I9S7q0kgwDed6r8vhi.X4eWFjQYwLkEvnHcHmyNHL.7WlXVoHBGWy');
INSERT INTO users (is_admin, username, approved, password_hashed) VALUES ('1','ruklas','1' ,'$2a$10$I9S7q0kgwDed6r8vhi.X4eWFjQYwLkEvnHcHmyNHL.7WlXVoHBGWy');
INSERT INTO users (is_admin, username, approved, password_hashed) VALUES ('1','GiorgosP77','1' ,'$2a$10$I9S7q0kgwDed6r8vhi.X4eWFjQYwLkEvnHcHmyNHL.7WlXVoHBGWy');
INSERT INTO users (is_admin, username, approved, password_hashed) VALUES ('1','juan','1' ,'$2a$10$I9S7q0kgwDed6r8vhi.X4eWFjQYwLkEvnHcHmyNHL.7WlXVoHBGWy');
