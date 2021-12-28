if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    const submitBtn = document.getElementById("register-btn");
    submitBtn.addEventListener('click', register);
}

async function register() {
    const name = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const reType = document.getElementById("password-retype").value;
    const authContainer = document.getElementsByClassName("auth-container")[0];
    try {
        if (password != reType) {
            // check whether the alert have already exist
            const toCheck= document.getElementById("retype-not-match");
            if (document.body.contains(toCheck)) {
                return;
            }
            const alertHolder = document.createElement('div');
            const alertContent = `<div id="retype-not-match">password does not match, please try again</div>`;
            alertHolder.innerHTML = alertContent;
            authContainer.append(alertHolder);
        } else {
            await axios.post('/api/v1/register', {
                name: name,
                email: email,
                password: password
            });
            window.location.assign("/notes.html");
        }
    } catch (error) {
        alert(error);
    }
}


