DROP DATABASE IF EXISTS department_DB;

CREATE DATABASE department_DB;

USE department_DB;


CREATE TABLE department (
  departmentID int NOT NULL AUTO_INCREMENT, PRIMARY KEY (departmentID),
  name varchar(30) NOT NULL
);

CREATE TABLE role (
  roleID int NOT NULL AUTO_INCREMENT, PRIMARY KEY (roleID),
  title varchar(30) NOT NULL,
  salary DECIMAL(10,2) NULL,
  departmentID INT NOT NULL,
  CONSTRAINT FK_department FOREIGN KEY (departmentID) REFERENCES department(departmentID)
);

CREATE TABLE employee (
  employeeID int NOT NULL AUTO_INCREMENT, PRIMARY KEY (employeeID),
  first_title varchar(30) NOT NULL,
  last_title varchar(30) NOT NULL,
  roleID INT NOT NULL,
  CONSTRAINT FK_role FOREIGN KEY (roleID) REFERENCES role(roleID),
  managerID INT,
  CONSTRAINT FK_manager FOREIGN KEY (managerID) REFERENCES employee(employeeID)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;





