if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

async function ready() {
    try {
        await showTasks(window.sessionStorage.getItem("token"));
        const addIcon = document.getElementById("add-icon");
        addIcon.addEventListener('click', triggerAddNote);   
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
        const oneNote = document.createElement('div');
        oneNote.classList.add("one-task-note");
        const newNoteContent = 
        `<div>
            <span><strong>${title}</strong></span>
            <span>${content}</span>
            <span><img src="./images/edit.svg" alt="edit-icon not found" class="small-icon pointer-cursor"></span>
            <span><img src="./images/delete.svg" alt="delete-icon not found" class="small-icon pointer-cursor"></span>
        </div>
        <div class="hidden-details" style="display: none;">
            <div>${createdAt}</div>
            <div>${comments}</div>
        </div>`;
        oneNote.innerHTML = newNoteContent;
        noteContainer.append(oneNote);

        oneNote.addEventListener('click', toggleDetails)
    }
}

async function toggleDetails(event) {
    // TODO: event.target is not easy to control
    const oneNote = event.target;
    const hidden = oneNote.lastChild;
    console.log(hidden)
    if (hidden.style.display === 'none') {
        hidden.style.display = "block";
    } else {
        hidden.style.display = "none";
    }
}

async function triggerAddNote() {
    // TODO: better make this floating window
    const interface = document.getElementsByClassName("adding-container")[0];
    if (interface.style.display === 'none') {
        interface.style.display = "block";
    } else {
        interface.style.display = "none";
    }
}
