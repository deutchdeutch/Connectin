import React from "react";

export default function ProfilPublic({ user, navigation, setUser }) {
    // Si par erreur on arrive ici sans utilisateur, on affiche un message
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
                <p>Utilisateur non trouvé</p>
                <button
                    onClick={() => navigation("accueil")}
                    className="mt-4 text-blue-500 underline"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }
    console.log("Données de l'utilisateur :", user);
    return (
        <div className="min-h-screen bg-slate-950 text-white p-4">
            {/* Header avec bouton retour */}
            <header className="h-20 bg-blue-800 flex items-center justify-around max-md:text-sm text-xl font-bold mb-8 rounded-lg">
                <h1 className="font-semibold max-md:text-sm  text-center rounded-full bg-blue-900 p-2 text-lg">
                    Profil {user.first_name}
                </h1>

                <span
                    onClick={() => navigation("accueil")}
                    className="cursor-pointer mr-4 bg-blue-700 hover:bg-blue-600 p-2 shadow rounded-full"
                >
                    CONNECT'IN
                </span>
                <button
                    onClick={() => {
                        localStorage.removeItem("access_token");
                        setUser?.({
                            first_name: "",
                            last_name: "",
                            email: "",
                        });
                        navigation("login");
                    }}
                    className="cursor-pointer mr-4 bg-blue-700 hover:bg-blue-600 p-2 shadow rounded-full"
                >
                    Déconnexion
                </button>
            </header>

            <div className="max-w-4xl mx-auto pb-10">
                {/* Bannière / Couverture */}
                <div className="h-48 bg-gradient-to-r from-blue-900 to-slate-800 w-full rounded-b-xl"></div>

                {/* Photo de profil et Infos principales */}
                <div className="px-6 -mt-12 flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
                    <div className="h-32 w-32 bg-slate-700 border-4 border-slate-950 rounded-full flex items-center justify-center text-4xl font-bold  object-cover shadow-2xl">
                        {user.profile_photo_path ? (
                            <img
                                src={`http://127.0.0.1:8000/storage/${user.profile_photo_path}`}
                                alt="Profil"
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-slate-300">
                                {user.first_name?.charAt(0).toUpperCase()}
                                {user.last_name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="mt-14 sm:mt-16 flex-1 text-center sm:text-left">
                        <h2 className="text-3xl font-bold">
                            {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-slate-400">
                            @{user.first_name?.toLowerCase()}_
                            {user.last_name?.toLowerCase()}
                        </p>
                    </div>

                    <div className="mt-6 sm:mt-20 flex gap-2">
                        {/* <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-all">
                            Ajouter
                        </button> */}
                        <button
                            onClick={() => navigation("messagerie")} // On change de page vers la messagerie
                            className="bg-slate-800 hover:bg-slate-700 px-6 py-2 cursor-pointer rounded-lg font-semibold transition-all border border-slate-700"
                        >
                            Message
                        </button>
                    </div>
                </div>

                {/* Contenu du profil (Bio, Amis, Posts) */}
                <div className="mt-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Colonne Gauche : Infos */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <h3 className="font-bold mb-4 text-slate-300 uppercase text-xs">
                                À propos
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="text-slate-400">
                                        {user.email}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    {/* 📅 <span className="text-slate-400">Membre depuis 2026</span> */}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Colonne Droite : Bio de l'utilisateur */}
                    <div className="bg-slate-900 max-md:w-auto w-110 p-8 rounded-xl border break-words border-slate-800 ">
                        {user.bio ? (
                            <p className="text-slate-300 text-left whitespace-pre-line">
                                {user.bio}
                            </p>
                        ) : (
                            <p className="text-slate-300 text-left whitespace-pre-line">
                                Aucune description pour le moment.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
