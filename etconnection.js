var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "department_DB"
});


connection.connect(function (err) {
    if (err) throw err;
    startTracker();
});


function startTracker() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Employee Department Search, choose the following",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add an employee",
                "Add a department",
                "Add a role",
                "EXIT"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    employeeViewTracker();
                    break;

                case "View all departments":
                    departmentsViewTracker();
                    break;

                case "View all roles":
                    rolesViewTracker();
                    break;

                case "Add an employee":
                    employeeAddTracker();
                    break;

                case "Add a department":
                    departmentsAddTracker();
                    break;

                case "Add a role":
                    rolesAddTracker();
                    break;

                case "EXIT":
                    endTracker();
                    break;
            }
        });
}


function departmentsViewTracker() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Department: " + res[i].name);
        }
        startTracker();
    });
}


function employeeViewTracker() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].first_title + res[i].last_title);
        }
        startTracker();
    });
}


function rolesViewTracker() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Role: " + res[i].title + res[i].salary);
        }
        startTracker();
    });
}


function employeeAddTracker() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "Employee's fist name: ",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "Employee's last name: "
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the new employee's role? ",
                    choices: function () {
                        var roleList = [];
                        for (let i = 0; i < res.length; i++) {
                            roleList.push(res[i].title);
                        }
                        return roleList;
                    },
                }
            ])
            .then(function (answer) {
                var selectedRoleID = 0;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].title == answer.role) {
                        selectedRoleID = res[i].roleID
                    }
                }

                connection.query("INSERT INTO employee SET ?", { first_title: answer.first_name, last_title: answer.last_name, roleID: selectedRoleID, },
                    function (err) {
                        if (err) throw err;
                        startTracker();
                    });
            });
    })
}


function departmentsAddTracker() {
    inquirer
        .prompt({
            name: "Adding_Department",
            type: "input",
            message: "Which department are you adding?",
        })
        .then(function (answer) {
            connection.query("INSERT INTO department SET ?", { name: answer.Adding_Department }, function (err, res) {
                if (err) throw err;
                startTracker();
            });
        });
}


function rolesAddTracker() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the Title of the new role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary of this position? (Enter a number?)"
                },
                {
                    name: "deptChoice",
                    type: "list",
                    message: "What is the department for the new role?",
                    choices: function () {
                        var deptArry = [];
                        for (let i = 0; i < res.length; i++) {
                            deptArry.push(res[i].name);
                        }
                        console.log(deptArry)
                        return deptArry;
                    },
                }
            ])
            .then(function (answer) {
                let deptID;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name == answer.deptChoice) {
                        deptID = res[i].departmentID;
                    }
                }

                connection.query("INSERT INTO role (title,salary,departmentID) VALUES (?,?,?)", [answer.title, answer.salary, deptID],
                    function (err, res) {
                        if (err) throw err;
                        console.log("Your new role has been added!");

                        startTracker();
                    })
            })
    })
}

function endTracker() {
    connection.end();
}

