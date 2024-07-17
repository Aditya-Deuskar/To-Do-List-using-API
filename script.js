document.addEventListener("DOMContentLoaded", () => {//DOMContentLoader makes sure that the script starts after all the html content is rendered, so this makes sure that the script runs after html so on right time.
    //accessing the element 
    const taskInput = document.getElementById("new-task");
    const addTaskButton = document.getElementById("add-task-button");
    const apiUrl = "https://jsonplaceholder.typicode.com/todos";
    const taskList = document.getElementById("task-list");


    //add eventlistner to add an element
    //inside an eventlistner we can use a normal func or a arrow func, whatever suits you better!
    addTaskButton.addEventListener("click", function () {
        let taskText = taskInput.value.trim();// trim removes the white spaces from the left and right hand side of the content

        if (taskText !== "") //if that text is not empty string, then add that task into list
        // in programming terms it is called as guard clause (here the guard clause is if-else statement)
        {
            addTask(taskText);
            taskInput.value = ""; // after saving the newly given task, then we clear the text area, so this does that.
        }
    });

    //function to add that element
    function addTask(taskText) {
        const newTask = { title: taskText, completed: false }; // yae backend mein display hoga, jo apan task denge vo tasktext mein ayega and completed hai ya nai vo pointer hoga ek backend ke liye...

        fetch(apiUrl, { // this is all standard maal what we have to write for APIs and stuff
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask), // as database stores data in json format, we use stringify to convert our java script object to a json format to store in db
        })
            .then(Response => Response.json())
            .then((task) => {
                console.log(task)
                displayTask(task.title, task.id);
            })
            .catch((error) => console.error("Failed during task", error));
    }

    //displaying an element
    //toh jab naya element add hoga list mein toh uske sath naya edit and delete button bhi add hoga na... yae vo karega
    function displayTask(title, id) {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = title;

        const editBtn = document.createElement("button");
        editBtn.textContent = "edit";
        editBtn.className = "edit=-tn";
        editBtn.addEventListener("click", () => editTask(id, span));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteTask(id, li));

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }

    function editTask(id, span) {
        const newText = prompt("Edit Task", span.textContent);

        if (newText !== null && newText !== "") {
            const updateTask = { title: newText, completed: false };
            fetch(`${apiUrl}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateTask),
            }).then(response => {
                console.log(response)

                if (response.ok === false) {
                    throw new Error("Failed to edit");
                }
                return response.json();
            }).then(() => {
                span.textContent = newText;
            }).catch(error => console.error("error in editing task", error));
        }
    }


    function deleteTask(id, li) {
        fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        }).then(response => {
            if (response.ok === true) {
                taskList.removeChild(li);
            }
            else {
                throw new Error("Failed to delete task");
            }
        }).catch(error => console.error("error in deleting task", error));
    }
}); 
