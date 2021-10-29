const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log("Connected to company_db")
)

init()//The init that started it all. The spark, if you will. Without it, this program is nothing. You are nothing. This world is but a distant memory in the mind of its creator.

//TODO SELECT x FROM (something other than * so it looks cleaner)

///////////////////////////////////////////////////////////////////
//FIND ALL DEPARTMENTS
const findDepartments = () => {
    return new Promise((fulfill,reject)=>{
        var departmentArray = []
        db.query('SELECT * FROM department',(error,results)=>{
            if(error) reject(error);
            for (let i = 0; i < results.length; i++) {
                departmentArray.push(results[i].name)
            }
            fulfill(departmentArray)
        })
    })
}

//FIND ALL ROLES
const findRoles = () => {
    return new Promise((fulfill,reject)=>{
        var roleArray = []
        db.query('SELECT * FROM role',(error,results)=>{
            if(error) reject(error);
            for (let i = 0; i < results.length; i++) {
                roleArray.push(results[i].title)
            }
            fulfill(roleArray)
        })
    })
}

//FIND ALL EMPLOYEES
const findEmployees = () => {
    return new Promise((fulfill,reject)=>{
        var employeeArray = []
        db.query('SELECT * FROM employee',(error,results)=>{
            if(error) reject(error);
            for (let i = 0; i < results.length; i++) {
                employeeArray.push(results[i].first_name + ' ' + results[i].last_name)
            }
            fulfill(employeeArray)
        })
    })
}

//FIND ALL MANAGERS
const findManagers = () => {
    return new Promise((fulfill,reject)=>{
        var managerArray = []
        db.query('SELECT * FROM employee WHERE role_id = 1',(error,results)=>{
            if(error) reject(error);
            for (let i = 0; i < results.length; i++) {
                managerArray.push(results[i].first_name + ' ' + results[i].last_name)
            }
            fulfill(managerArray)
        })
    })
}

//FIND ID OF SELECTED DEPARTMENT
const findDeptId = (spaghet) => {
    return new Promise((fulfill,reject) => {
        db.query('SELECT id FROM department WHERE name = ?', spaghet, (error,results)=>{
            if(error) reject(error);
            fulfill(results[0].id)
        })
    })
}

//FIND ID OF SELECTED ROLE
const findRoleId = (spaghet) => {
    return new Promise((fulfill,reject) => {
        db.query('SELECT id FROM role WHERE title = ?', spaghet, (error,results)=>{
            if(error) reject(error);
            fulfill(results[0].id)
        })
    })
}

//FIND ID OF SELECTED EMPLOYEE
const findEmployeeId = (spaghet) => {
    return new Promise((fulfill,reject) => {
        db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [spaghet.split(" ")[0],spaghet.split(" ")[1]], (error,results)=>{
            if(error) reject(error);
            fulfill(results[0].id)
        })
    })
}

//GET BUDGET //TODO - unfinished
const getBudget = (department) => {
    return new Promise((fulfill,reject) => {
        var budget = 0
        db.query('SELECT * FROM role WHERE department_id = ?',department,(error,roles)=>{
            if(error) reject(error);
            for (let i = 0; i < roles.length; i++) {
                db.query('SELECT * FROM employee WHERE role_id = ?',roles[i].id,(error,employees)=>{
                    if(error) reject(error);
                    budget += (roles[i].salary * employees.length)
                })
            }
        })
        fulfill(budget)
    })
}

///////////////////////////////////////////////////////////////////
//INITIAL ACTIONS (select a task from list of MAIN TASKS)
function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: ['View All Departments','View All Roles','View All Employees','Add a Department','Add a Role','Add an Employee','[Other]']
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
            case '[Other]':
                other()
                break;
        }
    })
}

//OTHER ACTIONS (select a task from list of OTHER TASKS)
function other() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'other',
            message: 'What would you like to do?',
            choices: ['View Employees By...','View Budgets','Update...','Delete...','[Go Back]','[Quit]']
        }
    ])
    .then(data => {
        switch(data.other) {
            case 'View Employees By...':
                viewEmployeesBy()
                break;
            case 'View Budgets':
                viewBudgets()
                break;
            case 'Update...':
                updateSomething()
                break;
            case 'Delete...':
                deleteSomething()
                break;
            case '[Go Back]':
                init()
                break;
            case '[Quit]':
                break;
        }
    })
}

//UPDATE either a department, role, or employee
function updateSomething() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'update',
            message: 'What would you like to update?',
            choices: ['Update Department','Update Role','Update Employee','[Go Back]']
        }
    ])
    .then(data => {
        switch (data.update) {
            case 'Update Department':
                updateDepartment()
                break;
            case 'Update Role':
                updateRole()
                break;
            case 'Update Employee':
                updateEmployee()
                break;
            case '[Go Back]':
                init()
                break;
        }
    })
}

//DELETE either a department, role, or employee
function deleteSomething() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'delete',
            message: 'What would you like to delete?',
            choices: ['Delete Department','Delete Role','Delete Employee','[Go Back]']
        }
    ])
    .then(data => {
        switch (data.delete) {
            case 'Delete Department':
                deleteDepartment()
                break;
            case 'Delete Role':
                deleteRole()
                break;
            case 'Delete Employee':
                deleteEmployee()
                break;
            case '[Go Back]':
                init()
                break;
        }
    })
}

//CONTINUE (asked after every action)
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

///////////////////////////////////////////////////////////////////
//ADD NEW DEPARTMENT
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

//ADD NEW ROLE
async function addRole() {

    var departmentList = await findDepartments();

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
            choices: departmentList
        }
    ])
    .then(async(data) => {

        var deptNum = await findDeptId(data.roleDept);

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
}

//ADD NEW EMPLOYEE
async function addEmployee() {

    var roleList = await findRoles();
    var managerList = await findManagers();

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
            choices: roleList
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: "Who is this employee's manager?",
            choices: managerList
        }
    ])
    .then(async(data) => {
        
        var roleNum = await findRoleId(data.employeeRole);
        var managerNum = await findEmployeeId(data.employeeManager)

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
}

//VIEW EMPLOYEES BY...
async function viewEmployeesBy() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'viewEmployeesBy',
            message: 'View employees by what?',
            choices: ['Department','Role','Manager','[Go Back]']
        }
    ])
    .then(data => {
        switch(data.viewEmployeesBy) {
            case 'Department':
                viewByDepartment()
                break;
            case 'Role':
                viewByRole()
                break;
            case 'Manager':
                viewByManager()
                break;
            case '[Go Back]':
                init()
                break;
        }
    })
}

//VIEW BY DEPARTMENT
async function viewByDepartment() {

    var departmentList = await findDepartments();

    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Which department?',
            choices: departmentList
        }
    ])
    .then(async(data) => {

        var deptNum = await findDeptId(data.department);
        
        db.query('SELECT * FROM role WHERE department_id = ?',deptNum,(error,results)=>{
            if(error) throw error;
            var rolesInDepartment = []
            for (let i = 0; i < results.length; i++) {
                rolesInDepartment.push(results[i].id)
            }
            db.query(`SELECT * FROM employee WHERE role_id IN (${rolesInDepartment})`,(error,results)=>{
                if(error) throw error;
                console.table(results)
                cont()
            })
        })
    })
}

//VIEW BY ROLE
async function viewByRole() {

    var roleList = await findRoles();

    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Which role?',
            choices: roleList
        }
    ])
    .then(async(data) => {

        var roleNum = await findRoleId(data.role);

        db.query('SELECT * FROM employee WHERE role_id = ?',roleNum,(error,results)=>{
            if(error) throw error;
            console.table(results)
            cont()
        })
    })
}

//VIEW BY MANAGER
async function viewByManager() {

    var managerList = await findManagers();

    inquirer.prompt([
        {
            type: 'list',
            name: 'manager',
            message: 'Which manager?',
            choices: managerList
        }
    ])
    .then(async(data) => {

        var managerNum = await findEmployeeId(data.manager);

        db.query('SELECT * FROM employee WHERE manager_id = ?',managerNum,(error,results)=>{
            if(error) throw error;
            console.table(results)
            cont()
        })
    })
}

//VIEW BUDGETS //TODO - unfinished
async function viewBudgets() {

    var departmentList = await findDepartments();

    inquirer.prompt([
        {
            type: 'list',
            name: 'budget',
            message: 'Which budget would you like to view?',
            choices: departmentList
        }
    ])
    .then(async(data) => {

        var budget = await getBudget(await findDeptId(data.budget));

        console.log(budget)
        cont()
    })
}

//UPDATE DEPARTMENT //TODO - unfinished
async function updateDepartment() {

    var departmentList = await findDepartments();

    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Which department would you like to update?',
            choices: departmentList
        }
    ])
    .then(data => {
        db.query('update FROM department WHERE name = ?',data.department,(error,results)=>{
            if(error) throw error;
            console.log(data.update + ' department updated!')
            db.query('SELECT * FROM department',(error,results)=>{
                if(error) throw error;
                console.table(results)
                cont()
                }
            )
        })
    })
}

//UPDATE ROLE //TODO - unfinished
async function updateRole() {

    var roleList = await findRoles();
    var departmentList = await findDepartments();

    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Which role would you like to update?',
            choices: roleList
        },
        {
            type: 'list',
            name: 'property',
            message: 'Which property would you like to change?',
            choices: ['Title','Salary','Department']
        }
    ])
    .then(async(data) => {

        var roleNum = await findRoleId(data.role);

        switch(data.property) {
            case 'Title':
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Please enter a new Title'
                    }
                ])
                .then(data => {
                    console.log(data.title + roleNum)
                    db.query("UPDATE role SET title = ? WHERE id = ?",(data.title,roleNum),(error,results)=>{
                        if(error) throw error;
                        console.log('Role updated!')
                        db.query('SELECT * FROM role',(error,results)=>{
                            if(error) throw error;
                            console.table(results)
                            cont()
                            }
                        )
                    })
                })
                break;
            case 'Salary':
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Please enter a new Salary'
                    }
                ])
                .then(data => {
                    db.query('UPDATE role SET salary = ? WHERE id = ?',(data.salary,roleNum),(error,results)=>{
                        if(error) throw error;
                        console.log('Role updated!')
                        db.query('SELECT * FROM role',(error,results)=>{
                            if(error) throw error;
                            console.table(results)
                            cont()
                            }
                        )
                    })
                })
                break;
            case 'Department':
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Please choose a new department',
                        choices: departmentList
                    }
                ])
                .then(async(data) => {

                    var deptNum = await findDeptId();

                    db.query('UPDATE role SET department_id = ? WHERE id = ?',(deptNum,roleNum),(error,results)=>{
                        if(error) throw error;
                        console.log('Role updated!')
                        db.query('SELECT * FROM role',(error,results)=>{
                            if(error) throw error;
                            console.table(results)
                            cont()
                            }
                        )
                    })
                })
                break;
        }
    })
}

//UPDATE EMPLOYEE //TODO - unfinished

//DELETE DEPARTMENT
async function deleteDepartment() {

    var departmentList = await findDepartments();

    inquirer.prompt([
        {
            type: 'list',
            name: 'delete',
            message: 'Which department would you like to delete?',
            choices: departmentList
        }
    ])
    .then(data => {
        db.query('DELETE FROM department WHERE name = ?',data.delete,(error,results)=>{
            if(error) throw error;
            console.log(data.delete + ' department deleted!')
            db.query('SELECT * FROM department',(error,results)=>{
                if(error) throw error;
                console.table(results)
                cont()
                }
            )
        })
    })
}

//DELETE ROLE
async function deleteRole() {

    var roleList = await findRoles();

    inquirer.prompt([
        {
            type: 'list',
            name: 'delete',
            message: 'Which role would you like to delete?',
            choices: roleList
        }
    ])
    .then(data => {
        db.query('DELETE FROM role WHERE title = ?',data.delete,(error,results)=>{
            if(error) throw error;
            console.log(data.delete + ' role deleted!')
            db.query('SELECT * FROM role',(error,results)=>{
                if(error) throw error;
                console.table(results)
                cont()
                }
            )
        })
    })
}

//DELETE EMPLOYEE
async function deleteEmployee() {

    var employeeList = await findEmployees();

    inquirer.prompt([
        {
            type: 'list',
            name: 'delete',
            message: 'Which employee would you like to delete?',
            choices: employeeList
        }
    ])
    .then(async(data) => {

        var employeeNum = await findEmployeeId(data.delete);

        db.query('DELETE FROM employee WHERE id = ?',employeeNum,(error,results)=>{
            if(error) throw error;
            console.log(data.delete + ' employee deleted!')
            db.query('SELECT * FROM employee',(error,results)=>{
                if(error) throw error;
                console.table(results)
                cont()
                }
            )
        })
    })
}