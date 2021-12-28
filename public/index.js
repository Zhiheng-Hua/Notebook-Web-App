if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    const submitBtn = document.getElementById("login-btn");
    submitBtn.addEventListener('click', login);
}

async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
        var {data: {token}} = await axios.post('/api/v1/login', {
            email: email,
            password: password
        });

        window.sessionStorage.setItem("token", token);

        window.location.assign("/notes.html");
    } catch (error) {
        alert(error);
    }
}

