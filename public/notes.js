if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

async function ready() {
    try {
        await showNotes(window.sessionStorage.getItem("token"));
        prepareAddingSection();
    } catch (error) {
        alert(error);
    }
}

async function showNotes(token) {
    const {data: {notes}} = await axios.get('/api/v1/notes', {
        headers: { Authorization: "Bearer " + token }
    });
    const noteContainer = document.getElementsByClassName("task-note-section")[0];
    for (var i = 0; i < notes.length; i++) {
        const { title, content, comments, createdAt, _id } = notes[i];
        noteContainer.append(noteElement(title, content, createdAt, comments, _id));
    }
}

function noteElement(title, content, createdAt, comments, _id) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add("one-task-note");
    noteContainer.id = _id;
    const newNoteContent = 
        `<div>
            <span><input type="text" disabled value="${title}" class="editable"></span>
            <span><input type="text" disabled value="${content}" class="editable"></span>
            <span><img src="./images/edit.svg" alt="edit-icon not found" class="edit-icon pointer-cursor"></span>
            <span><img src="./images/delete.svg" alt="delete-icon not found" class="delete-icon pointer-cursor"></span>
        </div>
        <div class="hidden-details" style="display: none;">
            <div><input type="text" disabled value="${new Date(createdAt).toDateString()}" class="editable"></div>
            <div><input type="text" disabled value="${comments}" class="editable"></div>
        </div>
        <div class="finish-edit-btn" style="display: none;"><button>done</button></div>`;
    noteContainer.innerHTML = newNoteContent;
    noteContainer.querySelector(".edit-icon").addEventListener('click', editNote)
    noteContainer.querySelector(".delete-icon").addEventListener('click', deleteNote);
    noteContainer.querySelector(".editable").parentElement.addEventListener('click', () => {
        toggleDetails(noteContainer);
    });
    noteContainer.querySelector(".finish-edit-btn").addEventListener('click', (event) => {
        updateNote(event, noteContainer);
    });
    return noteContainer;
}

function toggleDetails(noteContainer) {
    const hidden = noteContainer.querySelector(".hidden-details");
    if (hidden.style.display === 'none') {
        hidden.style.display = "block";
    } else {
        hidden.style.display = "none";
    }
}

async function updateNote(event, noteContainer) {
    const editable = noteContainer.querySelectorAll(".editable");
    for (var item of editable) {
        item.style.border = "none";         // hide border
        item.setAttribute("disabled", "");  // disable input
    }
    noteContainer.querySelector(".hidden-details").style.display = "none";
    event.target.parentElement.style.display = "none";
    // update in DB
    const id = noteContainer.id;
    const title = noteContainer.querySelectorAll('input')[0].value;
    const content = noteContainer.querySelectorAll('input')[1].value;
    const comments = noteContainer.querySelectorAll('input')[3].value;
    await axios.patch(`/api/v1/notes/${id}`, {
        title: title, content: content, comments:comments
    }, {
        headers: { Authorization: "Bearer " + window.sessionStorage.getItem("token") }
    });
}

function editNote(event) {
    const icon = event.target;
    const noteContainer = icon.parentElement.parentElement.parentElement;
    const editable = noteContainer.querySelectorAll(".editable");
    for (var item of editable) {
        item.style.border = " ";
        item.removeAttribute("disabled");
    }
    noteContainer.querySelector(".hidden-details").style.display = "block";
    noteContainer.querySelector(".finish-edit-btn").style.display = "block";
}

async function deleteNote(event) {
    const icon = event.target;
    const noteContainer = icon.parentElement.parentElement.parentElement;
    noteContainer.remove();
    // delete from DB
    await axios.delete(`/api/v1/notes/${noteContainer.id}`, {
        headers: { Authorization: "Bearer " + window.sessionStorage.getItem("token") }
    });
}

function triggerAddNote() {
    const interface = document.getElementsByClassName("adding-section")[0];
    if (interface.style.display === 'none') {
        interface.style.display = "block";
    } else {
        interface.style.display = "none";
    }
}

function prepareAddingSection() {
    const addIcon = document.getElementById("add-icon");
    addIcon.addEventListener('click', triggerAddNote);

    const interface = document.getElementsByClassName("adding-section")[0];
    const allItems = interface.querySelectorAll('div');
    const btnsContainer = allItems[3];
    const addBtn = btnsContainer.firstElementChild;
    const cancelBtn = btnsContainer.lastElementChild;

    addBtn.addEventListener('click', () => {
        const title = allItems[0].querySelector('input').value;
        const content = allItems[1].querySelector('input').value;
        const comments = allItems[2].querySelector('input').value;
        const createdAt = new Date(Date.now()).toDateString();
        addNotes(title, content, comments, createdAt)
        interface.style.display = "none";
        clearInputHelper(allItems);
    });

    cancelBtn.addEventListener('click', () => {
        interface.style.display = "none";
        clearInputHelper(allItems);
    });
}

async function addNotes(title, content, comments, createdAt) {
    const newNote = noteElement(title, content, createdAt, comments);
    document.getElementsByClassName("task-note-section")[0].append(newNote);
    // add in DB
    await axios.post('/api/v1/notes', {
        title, content, createdAt, comments
    }, {
        headers: { Authorization: "Bearer " + window.sessionStorage.getItem("token") }
    });
}

function clearInputHelper(allItems) {
    for (var item of allItems) {
        allItems[0].querySelector('input').value = "";
        allItems[1].querySelector('input').value = "";
        allItems[2].querySelector('input').value = "";
    }
}
