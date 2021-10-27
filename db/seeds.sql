INSERT INTO department (name)
VALUES  ("Management"),
        ("Sales"),
        ("Human Resources"),
        ("Operations");

INSERT INTO role (title,salary,department_id)
VALUES  ("Manager",32.50,1),
        ("Sales Representative",18.50,2),
        ("Customer Service Representative",22.75,2),
        ("H.R. Representative",25.00,3),
        ("Warehouse Guy",12.25,4),
        ("Forklift Drifter",28.00,4);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ("Danielle","LeBeau",1,NULL),
        ("Nasser","Abdulla",1,NULL),
        ("Artur","Ehran",2,2),
        ("Jake","Hotchkiss",2,1),
        ("James","Crosby",3,2),
        ("Stacey","Spencer",4,NULL),
        ("Donny","Sanders",5,2),
        ("Bierce","Biddy",6,1);






-- Is there any way to make this more modular? What if I want to add a role or department?