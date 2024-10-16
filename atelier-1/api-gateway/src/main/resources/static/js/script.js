import { showAlert, Alert } from './alerts.js';
import { formatBalance } from './balance.js';

document.addEventListener("DOMContentLoaded", function () {
  /* CREATE HEADER */
  const header = document.createElement("header");

  const navbar = document.createElement("nav");
  navbar.classList.add("navbar");

  const logoTitleContainer = document.createElement("div");
  logoTitleContainer.classList.add("logo-title-container");

  const logo = document.createElement("img");
  logo.classList.add("logo");
  logo.src = 'assets/logo.png';

  const title = document.createElement("div");
  title.classList.add("title");
  title.classList.add("scooby");
  title.textContent = "ScoobyCards";

  logoTitleContainer.appendChild(logo);
  logoTitleContainer.appendChild(title);

  const navLinks = document.createElement("ul");
  navLinks.classList.add("nav-links");

  const links = [
    { text: "<i class=\"fa-solid fa-house\"></i> Accueil", href: "index.html" },
    { text: "<i class=\"fa-solid fa-list\"></i> Liste des cartes", href: "cardList.html" },
    { text: "<i class=\"fa-solid fa-layer-group\"></i> Mes cartes", href: "cards.html" },
    { text: "<i class=\"fa-solid fa-gamepad\"></i> Jouer", href: "roomList.html" }
  ];

  links.forEach(link => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.innerHTML = link.text;
    a.href = link.href;
    li.appendChild(a);
    navLinks.appendChild(li);
  });

  const headerBadgesContainer = document.createElement("div");
  headerBadgesContainer.classList.add("badges-container");

  const usernameBadge = document.createElement("a");
  usernameBadge.id = "badge-username";
  usernameBadge.classList.add("badge");
  usernameBadge.classList.add("badge-primary-dark");
  usernameBadge.classList.add("pointer");
  usernameBadge.classList.add("no-decoration");
  usernameBadge.classList.add("centered-icon-text");
  usernameBadge.innerHTML = "<i class=\"fa-solid fa-right-to-bracket\"></i> Se connecter";
  usernameBadge.href = "login.html";

  const balanceBadge = document.createElement("div");
  balanceBadge.classList.add("badge");
  balanceBadge.id = "badge-balance";
  balanceBadge.classList.add("badge-primary-dark");
  balanceBadge.innerHTML = "Solde : <span id='balance-badge-amount'>0,00</span> €";
  balanceBadge.classList.add("hidden");

  headerBadgesContainer.appendChild(usernameBadge);
  headerBadgesContainer.appendChild(balanceBadge);

  navbar.appendChild(logoTitleContainer);
  navbar.appendChild(navLinks);
  navbar.appendChild(headerBadgesContainer);
  header.appendChild(navbar);

  document.body.insertBefore(header, document.body.firstChild);

  /* GET LOGGED USER */
  const currentPage = window.location.pathname.split("/").pop();
  const userToken = localStorage.getItem("scoobycards-user-token");
  const hasToken = !!userToken;
  if (currentPage !== 'register.html' && currentPage !== 'login.html') {
    if (hasToken) {
      fetch("http://localhost:8080/user/current", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + userToken,
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(response => {
          if (response.ok) {
            response.json().then(user => {
              const userIdentityStr = `${user.surname} ${user.name}`;

              usernameBadge.innerHTML = `<img class="user-icon" src="https://api.dicebear.com/8.x/thumbs/svg?seed=${user.username}"></img> ${userIdentityStr}`;
              usernameBadge.href = `#`;

              const dropdownMenu = document.createElement("div");
              dropdownMenu.classList.add("dropdown-menu");
              dropdownMenu.classList.add("hidden");

              const balanceLink = document.createElement("a");
              balanceLink.href = "user.html";
              balanceLink.textContent = "Mon compte";

              const logoutLink = document.createElement("a");
              logoutLink.href = "#";
              logoutLink.textContent = "Se déconnecter";
              logoutLink.addEventListener("click", () => {
                localStorage.removeItem("scoobycards-user-token");
                window.location.replace("./cardList.html");
              });

              dropdownMenu.appendChild(balanceLink);
              dropdownMenu.appendChild(logoutLink);

              usernameBadge.appendChild(dropdownMenu);

              usernameBadge.addEventListener("click", () => {
                dropdownMenu.classList.toggle("hidden");
              });

              document.addEventListener("click", (event) => {
                if (!usernameBadge.contains(event.target)) {
                  dropdownMenu.classList.add("hidden");
                }
              });

              const identities = document.querySelectorAll(".identity");
              identities.forEach(identity => {
                identity.innerHTML = userIdentityStr;
              });

              const identityInputSurname = document.querySelector("#form-user-surname");
              const identityInputName = document.querySelector("#form-user-name");
              const identityInputEmail = document.querySelector("#form-user-email");
              const identityInputUsername = document.querySelector("#form-user-username");

              if (currentPage == 'user.html') {
                if (identityInputSurname) identityInputSurname.value = user.surname;
                if (identityInputName) identityInputName.value = user.name;
                if (identityInputEmail) identityInputEmail.value = user.email;
                if (identityInputUsername) identityInputUsername.value = user.username;

                const userIcon = document.querySelector("#user-icon");
                userIcon.src = `https://api.dicebear.com/8.x/thumbs/svg?seed=${user.username}`;
              }

              const balanceBadgeAmount = document.querySelector("#balance-badge-amount");
              balanceBadgeAmount.innerHTML = formatBalance(user.balance);

              const balanceBadge = document.querySelector("#badge-balance");
              balanceBadge.classList.remove("hidden");
            }).catch(error => {
              console.error("Error when parsing JSON:", error);
              if (hasToken) {
                localStorage.removeItem("scoobycards-user-token");
              }
            });
          } else if (hasToken) {
            localStorage.removeItem("scoobycards-user-token");
          }
        });
    }

    if (hasToken && !localStorage.getItem("scoobycards-user-token")) {
      showAlert(Alert.ERROR, "Votre session a expiré. Veuillez vous reconnecter.");
    }
  }
  else if (hasToken) {
    localStorage.removeItem("scoobycards-user-token");
  }
});

