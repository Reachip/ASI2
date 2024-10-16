const Alert = {
    SUCCESS: { code: "success", icon: `<i class="fa-solid fa-circle-check"></i>` },
    ERROR: { code: "error", icon: `<i class="fa-solid fa-triangle-exclamation"></i>` },
};

function showAlert(type, message) {
    const alertsContainer = document.querySelector("#alerts");

    const alertDiv = document.createElement("div");
    alertDiv.id = `register-alert-${type.code}`;
    alertDiv.classList.add("alert");
    alertDiv.classList.add(`alert-${type.code}`);
    alertDiv.innerHTML = `${type.icon} ${message}`;

    alertsContainer.innerHTML = ``;
    alertsContainer.appendChild(alertDiv);
}

export { showAlert, Alert };
