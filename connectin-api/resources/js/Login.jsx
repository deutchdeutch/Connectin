import React, { useState } from "react";
import logoUrl from "../asset/logoConnectin.png";
export default function Login({ navigation, setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                //  On stocke le token pour rester connecté
                localStorage.setItem("access_token", data.access_token);

                //  CORRECTION CRITIQUE : On stocke les infos de l'utilisateur
                // Sans cette ligne, App.js reprend les vieilles infos (Aminata) au rafraîchissement
                localStorage.setItem("user_data", JSON.stringify(data.user));

                //  On met à jour l'état actuel de l'application
                setUser(data.user);

                alert("Connexion réussie !");
                navigation("accueil");
            } else {
                setError(data.message || "Email ou mot de passe invalide.");
            }
        } catch (err) {
            setError(
                "Le serveur ne répond pas. Vérifie ton terminal (php artisan serve).",
            );
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <h1 className="h-20 text-white bg-blue-800 flex items-center justify-center text-xl font-semibold w-full">
                CONNECT'IN
            </h1>
            <div className="flex-1 flex flex-row max-md:flex-col items-center gap gap-2 justify-evenly">
                <img
                    src={logoUrl}
                    alt="logo connectin"
                    className="h-90 max-md:h-50 border border-black"
                />
                <div className="bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-800 w-full max-w-md">
                    <h2 className="text-2xl font-extralight text-white mb-6 text-center">
                        Connexion
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-2 rounded mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-slate-300 text-sm">
                                Email
                            </label>
                            <input
                                type="email"
                                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="exemple@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-slate-300 text-sm">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 cursor-pointer rounded-lg transition-colors mt-2"
                        >
                            Se connecter
                        </button>

                        <p
                            className="text-slate-400 text-sm text-center mt-4 cursor-pointer hover:underline"
                            onClick={() => navigation("inscription")}
                        >
                            Pas encore inscrit ? Cliquez ici
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
