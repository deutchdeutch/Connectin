import "./bootstrap";
import { createRoot } from "react-dom/client";
import { StrictMode, useEffect } from "react"; // Ajoute useEffect ici
import React, { useState } from "react";
import Login from "./Login";
import Inscription from "./Inscription";
import Profil from "./Profil";
import Accueil from "./Accueil";
import ProfilPublic from "./Profilpublic";
import Messagerie from "./Messagerie";

export default function App() {
    const tokenExiste = localStorage.getItem("access_token");
    const navigate = (nomDeLaPage) => {
        // On change l'URL dans la barre d'adresse
        // Le premier paramètre est un objet vide {}, le second un titre "", et le troisième le chemin "/"
        window.history.pushState({}, "", "/" + nomDeLaPage);

        // On change l'état pour que React affiche le bon composant
        setPage(nomDeLaPage);
    };
    const [page, setPage] = useState(tokenExiste ? "accueil" : "login");

    // TOI (l'utilisateur connecté)
    const [user, setUser] = useState({
        last_name: "",
        first_name: "",
        email: "",
    });

    // L'AUTRE (l'utilisateur que tu cliques dans la recherche)
    const [visitedUser, setVisitedUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user_data");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const pages = {
        login: <Login navigation={navigate} setUser={setUser} />,
        inscription: <Inscription navigation={navigate} setUser={setUser} />,
        // On passe setVisitedUser à l'Accueil pour qu'il puisse nous dire sur qui on clique
        accueil: (
            <Accueil
                navigation={navigate}
                user={user}
                setVisitedUser={setVisitedUser}
            />
        ),
        profil: <Profil navigation={navigate} user={user} setUser={setUser} />,
        // ICI : On passe visitedUser (l'autre) et non user (toi) !
        ProfilPublic: <ProfilPublic navigation={navigate} user={visitedUser} />,
        messagerie: (
            <Messagerie
                user={user}
                userVisite={visitedUser}
                navigation={navigate}
            />
        ),
    };

    return <div className="App">{pages[page]}</div>;
}

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <App />
    </StrictMode>,
);
