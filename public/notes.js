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
    const {data: {notes}} = await axios.get('/api/v1/notes', {
        headers: {
            Authorization: "Bearer " + token
        }
    });
    const noteContainer = document.getElementsByClassName("task-note-section")[0];
    for (var i = 0; i < notes.length; i++) {
        const { title, content, comments, createdAt } = notes[i];
        noteContainer.append(noteElement(title, content, createdAt, comments));
    }
}

function noteElement(title, content, createdAt, comments) {
    const oneNote = document.createElement('div');
    oneNote.classList.add("one-task-note");
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
        </div>`;
    oneNote.innerHTML = newNoteContent;
    oneNote.querySelector(".edit-icon").addEventListener('click', editNote)
    oneNote.querySelector(".delete-icon").addEventListener('click', deleteNote);
    oneNote.querySelector(".editable").parentElement.addEventListener('click', toggleDetails);
    return oneNote;
}

function toggleDetails(event) {
    const oneNote = event.target.parentElement.parentElement.parentElement;
    const hidden = oneNote.querySelector(".hidden-details");
    if (hidden.style.display === 'none') {
        hidden.style.display = "block";
    } else {
        hidden.style.display = "none";
    }
}

function editNote(event) {
    const icon = event.target;
    const oneTaskNoteContainer = icon.parentElement.parentElement.parentElement;
    const editable = oneTaskNoteContainer.querySelectorAll(".editable");
    for (var item of editable) {
        item.style.border = " ";     // set to default border
        item.removeAttribute("disabled");
    }
    const btnHolder = document.createElement('div');
    btnHolder.classList.add("finish-edit-btn");
    btnHolder.innerHTML = `<button>done</button>`;
    oneTaskNoteContainer.append(btnHolder);

    btnHolder.addEventListener('click', () => {
        // TODO: update in DB
        for (var item of editable) {
            item.style.border = "none";         // hide border
            item.setAttribute("disabled", "");  // disable input
        }
        btnHolder.remove();                     // remove btn
    });
}

function deleteNote(event) {
    const icon = event.target;
    icon.parentElement.parentElement.parentElement.remove();    // one-task-note
    // TODO: delete from DB
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
        const newNote = noteElement(title, content, createdAt, comments);
        document.getElementsByClassName("task-note-section")[0].append(newNote);
        console.log(newNote)
        interface.style.display = "none";
        clearInputHelper(allItems);
    });

    cancelBtn.addEventListener('click', () => {
        interface.style.display = "none";
        clearInputHelper(allItems);
    });
}

function clearInputHelper(allItems) {
    for (var item of allItems) {
        allItems[0].querySelector('input').value = "";
        allItems[1].querySelector('input').value = "";
        allItems[2].querySelector('input').value = "";
    }
}
