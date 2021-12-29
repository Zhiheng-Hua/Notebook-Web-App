if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

async function ready() {
    try {
        await showTasks(window.sessionStorage.getItem("token"));
        prepareAddingSection();
    } catch (error) {
        alert(error);
    }
}

async function showTasks(token) {
    const {data: {tasks}} = await axios.get('/api/v1/tasks', {
        headers: { Authorization: "Bearer " + token }
    });
    const taskContainer = document.getElementsByClassName("task-note-section")[0];
    for (var i = 0; i < tasks.length; i++) {
        const { name, deadline, importance, completed, _id } = tasks[i];
        taskContainer.append(taskElement(name, deadline, importance, completed, _id));
    }
}

function taskElement(name, deadline, importance, completed, _id) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add("one-task-note");
    taskContainer.id = _id;

    const stars = `<span class="fa fa-star" style="color: orange;"></span>`.repeat(importance);
    const tick = completed ? "checked" : "false";
    const newTaskContent = 
        `<div>
            <span><input type="text" disabled value="${name}" class="editable"></span>
            <span><input type="text" disabled value="${deadline}" class="editable"></span>
            <span><input type="text" disabled value="${importance}" class="editable" style="display: none;"></span>
            <span style="margin-right: 40px;" class="stars">${stars}</span>
            <span><input type="checkbox" disabled ${tick} class="editable"></span>
            <span><img src="./images/edit.svg" alt="edit-icon not found" class="edit-icon pointer-cursor"></span>
            <span><img src="./images/delete.svg" alt="delete-icon not found" class="delete-icon pointer-cursor"></span>
        </div>
        <div class="finish-edit-btn" style="display: none;"><button>done</button></div>`;
    taskContainer.innerHTML = newTaskContent;
    taskContainer.querySelector(".edit-icon").addEventListener('click', editTask)
    taskContainer.querySelector(".delete-icon").addEventListener('click', deleteTask);
    taskContainer.querySelector(".finish-edit-btn").addEventListener('click', (event) => {
        updateTask(event, taskContainer);
    });
    return taskContainer;
}

// ++++++++++++++++++++++++++++++++++++++++++++
async function updateTask(event, taskContainer) {
    const editable = taskContainer.querySelectorAll(".editable");
    for (var item of editable) {
        item.style.border = "none";         // hide border
        item.setAttribute("disabled", "");  // disable input
    }
    event.target.parentElement.style.display = "none";  // hide done button
    // update in DB
    const id = taskContainer.id;
    const name = editable[0].value;
    const deadline = editable[1].value;
    const importance = editable[2].value;
    const completed = editable[3].checked;
    await axios.patch(`/api/v1/tasks/${id}`, {
        name, deadline, importance, completed
    }, {
        headers: { Authorization: "Bearer " + window.sessionStorage.getItem("token") }
    });
    // update stars on webpage
    editable[2].style.display = "none";
    const stars = `<span class="fa fa-star" style="color: orange;"></span>`.repeat(importance);
    const starsDOM = taskContainer.querySelector('.stars');
    starsDOM.innerHTML = stars;
    starsDOM.style.display = "inline-block";
}

function editTask(event) {
    const icon = event.target;
    const taskContainer = icon.parentElement.parentElement.parentElement;
    const editable = taskContainer.querySelectorAll(".editable");
    for (var item of editable) {
        item.style.border = " ";
        item.removeAttribute("disabled");
    }
    editable[2].style.display = "inline-block";
    taskContainer.querySelector(".finish-edit-btn").style.display = "block";
    taskContainer.querySelector('.stars').style.display = "none";
}

async function deleteTask(event) {
    const icon = event.target;
    const taskContainer = icon.parentElement.parentElement.parentElement;
    taskContainer.remove();
    // delete from DB
    await axios.delete(`/api/v1/tasks/${taskContainer.id}`, {
        headers: { Authorization: "Bearer " + window.sessionStorage.getItem("token") }
    });
}

function triggerAddTask() {
    const interface = document.getElementsByClassName("adding-section")[0];
    if (interface.style.display === 'none') {
        interface.style.display = "block";
    } else {
        interface.style.display = "none";
    }
}

function prepareAddingSection() {
    const addIcon = document.getElementById("add-icon");
    addIcon.addEventListener('click', triggerAddTask);

    const interface = document.getElementsByClassName("adding-section")[0];
    const allItems = interface.querySelectorAll('div');

    const btnsContainer = allItems[4];
    const addBtn = btnsContainer.firstElementChild;
    const cancelBtn = btnsContainer.lastElementChild;

    addBtn.addEventListener('click', () => {
        // name, deadline, importance, completed, _id
        const name = allItems[0].querySelector('input').value;
        const deadline = allItems[1].querySelector('input').value;
        const importance = allItems[2].querySelector('input').value;
        const completed = allItems[3].querySelector('input').checked;
        addNotes(name, deadline, importance, completed);
        interface.style.display = "none";
        clearInputHelper(allItems);
    });

    cancelBtn.addEventListener('click', () => {
        interface.style.display = "none";
        clearInputHelper(allItems);
    });
}

async function addNotes(name, deadline, importance, completed) {
    const newNote = taskElement(name, deadline, importance, completed, "");     // set id later
    // add in DB
    const {data: {task: {_id}}} = await axios.post('/api/v1/tasks', {
        name, deadline, importance, completed
    }, {
        headers: { Authorization: "Bearer " + window.sessionStorage.getItem("token") }
    });
    newNote.id = _id;
    document.getElementsByClassName("task-note-section")[0].append(newNote);
}

function clearInputHelper(allItems) {
    for (var i = 0; i < 4; i++) {
        allItems[i].querySelector('input').value = "";
    }
}
