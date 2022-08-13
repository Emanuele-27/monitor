const hostAdm = document.getElementById("hostAdm").innerText;
const hostAe = document.getElementById("hostAe").innerText;
const hostAer = document.getElementById("hostAer").innerText;
const hostSogei = document.getElementById("hostSogei").innerText;

let cssDom;

// Mapping dominio - nome file css
switch (window.location.hostname) {
    case hostAdm:
        cssDom = 'adm';
        break;
    case hostAe:
        cssDom = 'agenzia-entrate';
        break;
    case hostAer:
        cssDom = 'ader';
        break;
    case hostSogei:
        cssDom = 'sogei';
        break;
    default:
        cssDom = 'adm';
        break
}

const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', '/css/' + cssDom + '.css');
document.head.appendChild(link);