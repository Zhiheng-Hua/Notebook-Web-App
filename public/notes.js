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
    const {data: {notes, nbHits}} = await axios.get('/api/v1/notes', {
        headers: { Authorization: "Bearer " + token }
    });
    document.getElementsByClassName('no-item-prompt')[0].innerHTML = (nbHits == "0") ? "You have not yet add any notes" : "";
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
        `<div class="notes-shown">
            <span><input type="text" disabled value="${title}" class="editable" style="font-weight: bold;"></span>
            <span><input type="text" disabled value="${content}" class="editable"></span>
            <span><img src="./images/expand.svg" alt="expand-icon not found" class="expand-icon pointer-cursor"></span>
            <span><img src="./images/edit.svg" alt="edit-icon not found" class="edit-icon pointer-cursor"></span>
            <span><img src="./images/delete.svg" alt="delete-icon not found" class="delete-icon pointer-cursor"></span>
        </div>
        <div class="hidden-details" style="display: none;">
            <div>CreatedAt:<input type="text" disabled value=" ${new Date(createdAt).toDateString()}" class="editable"></div>
            <div>Comments:<input type="text" disabled value=" ${comments}" class="editable"></div>
        </div>
        <div class="finish-edit-btn" style="display: none;"><button>done</button></div>`;
    noteContainer.innerHTML = newNoteContent;
    noteContainer.querySelector(".edit-icon").addEventListener('click', editNote)
    noteContainer.querySelector(".delete-icon").addEventListener('click', deleteNote);
    noteContainer.querySelector(".expand-icon").addEventListener('click', toggleDetails);
    noteContainer.querySelector(".finish-edit-btn").addEventListener('click', (event) => {
        updateNote(event, noteContainer);
    });
    return noteContainer;
}

function toggleDetails(event) {
    const hidden = event.target.parentElement.parentElement.parentElement.querySelector(".hidden-details");
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
    const title = editable[0].value;
    const content = editable[1].value;
    const comments = editable[3].value;
    await axios.patch(`/api/v1/notes/${id}`, {
        title: title, content: content, comments:comments
    }, {
        headers: { Authorization: "Bearer " + window.sessionStorage.getItem("token") }
    });
    // re-enable click expand functionality
    noteContainer.querySelector(".expand-icon").addEventListener('click', toggleDetails);
}

function editNote(event) {
    const icon = event.target;
    const noteContainer = icon.parentElement.parentElement.parentElement;
    const editable = noteContainer.querySelectorAll(".editable");
    // temporarily disable click expand functionality
    noteContainer.querySelector(".expand-icon").removeEventListener('click', toggleDetails);
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
    checkHaveItem();
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
    const newNote = noteElement(title, content, createdAt, comments, "");
    // add in DB
    const {data: {note: {_id}}} = await axios.post('/api/v1/notes', {
        title, content, createdAt, comments
    }, {
        headers: { Authorization: "Bearer " + window.sessionStorage.getItem("token") }
    });
    newNote.id = _id;
    document.getElementsByClassName("task-note-section")[0].append(newNote);
    checkHaveItem();
}

function clearInputHelper(allItems) {
    for (var i = 0; i < 3; i++) {
        allItems[i].querySelector('input').value = "";
    }
}

async function checkHaveItem() {
    const token = window.sessionStorage.getItem("token");
    const {data: {nbHits}} = await axios.get('/api/v1/notes', {
        headers: { Authorization: "Bearer " + token }
    });
    document.getElementsByClassName('no-item-prompt')[0].innerHTML = (nbHits == "0") ? "You have not yet add any notes" : "";
}
