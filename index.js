const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log("Connected to company_db")
)


init()


function cont() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'cont',
            message: 'Would you like to continue?',
            choices: ['Continue','Quit']
        }
    ])
    .then(data => {
        switch(data.cont){
            case 'Continue':
                init()
                break;
            case 'Quit':
                break;
        }
    })
}

function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: ['View All Departments','View All Roles','View All Employees','Add a Department','Add a Role','Add an Employee','Update Employee Role','Other']
        }
    ])
    .then(data => {
        switch(data.init) {
            case 'View All Departments':
                db.query('SELECT * FROM department',(error,results)=>{
                    if(error){
                        console.log(error)
                    } else {
                        console.table(results)
                        cont()
                    }
                })
                break;
            case 'View All Roles':
                db.query('SELECT * FROM role',(error,results)=>{
                    if(error){
                        console.log(error)
                    } else {
                        console.table(results)
                        cont()
                    }
                })
                break;
            case 'View All Employees':
                db.query('SELECT * FROM employee',(error,results)=>{
                    if(error){
                        console.log(error)
                    } else {
                        console.table(results)
                        cont()
                    }
                })
                break;
            case 'Add a Department':
                addDepartment()
                break;
            case 'Add a Role':
                addRole()
                break;
            case 'Add an Employee':
                addEmployee()
                break;
            case 'Update Employee Role':
                updateEmployeeRole()
                break;
            case 'Other':
                console.log('coming soon');
                break;
        }
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'What would you like to name this department?'
        }
    ])
    .then(data => {
        db.query('INSERT INTO department (name) VALUES (?)', data.deptName, (error,results)=>{
            if(error) throw error;
            console.log('Department added!')
            db.query('SELECT * FROM department',(error,results)=>{
                if(error) throw error;
                console.table(results)
                cont()
            }
        )})
    })
}

function addRole() {
    var deptChoices = []
    db.query('SELECT * FROM department', (error,results)=>{
        if(error) throw error;
        for (let i = 0; i < results.length; i++) {
            deptChoices.push(results[i].name)
        }
    })
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What would you like to name this role?'
        },
        {
            type: 'number',
            name: 'roleSalary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'roleDept',
            message: 'What department does this role belong to?',
            choices: deptChoices
        }
    ])
    .then(data => {
        db.query('SELECT id FROM department WHERE name = ?', data.roleDept, (error,results)=>{
            if(error) throw error;
            var deptNum = results[0].id
            //how can i async this instead of nesting it?
            db.query('INSERT INTO role (title,salary,department_id) VALUES (?,?,?)',[data.roleName,data.roleSalary,deptNum], (error,results)=>{
                if(error) throw error;
                console.log('Role added!')
                db.query('SELECT * FROM role',(error,results)=>{
                    if(error) throw error;
                    console.table(results)
                    cont()
                    }
                )
            })
        })
    })
}

function addEmployee() {
    var roleChoices = []
    db.query('SELECT * FROM role', (error,results)=>{
        if(error) throw error;
        for (let i = 0; i < results.length; i++) {
            roleChoices.push(results[i].title)
        }
    })
    var managerList = []
    db.query('SELECT * FROM employee WHERE role_id = 1', (error,results)=>{
        if(error) throw error;
        for (let i = 0; i < results.length; i++) {
            managerList.push(results[i].first_name + ' ' + results[i].last_name)
        }
    })
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter first name'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter last name'
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: "What is this employee's role?",
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: "Who is this employee's manager?",
            choices: managerList
        }
    ])
    .then(data => {
        db.query('SELECT id FROM role WHERE title = ?', data.employeeRole, (error,results)=>{
            if(error) throw error;
            var roleNum = results[0].id

            db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [data.employeeManager.split(" ")[0],data.employeeManager.split(" ")[1]], (error,results)=>{
                if(error) throw error;
                var managerNum = results[0].id//why array

                db.query('INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)',[data.firstName,data.lastName,roleNum,managerNum], (error,results)=>{
                    if(error) throw error;
                    console.log('Employee added!')
                    db.query('SELECT * FROM employee',(error,results)=>{
                        if(error) throw error;
                        console.table(results)
                        cont()
                        }
                    )
                })
            })
        })
    })
}