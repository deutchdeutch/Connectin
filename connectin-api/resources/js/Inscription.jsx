import React, { useState } from "react";

export default function Inscription({ navigation, setUser }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            alert("Attention : Les mots de passe ne sont pas identiques !");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Inscription réussie !");

                // --- CORRECTIONS POUR LA PERSISTANCE ---

                //  On met à jour l'utilisateur dans l'état React
                setUser(data.user);

                //  On utilise "access_token" (et non "token") pour que App.js le reconnaisse
                localStorage.setItem("access_token", data.access_token);

                //  On enregistre les infos de l'utilisateur en texte (JSON)
                // C'est ce qui évite qu'Aminata ne revienne à l'actualisation !
                localStorage.setItem("user_data", JSON.stringify(data.user));

                //  On redirige vers l'accueil
                navigation("accueil");
            } else {
                setError(data.message || "L'inscription a échoué.");
                console.log("Erreurs du serveur :", data.errors);
            }
        } catch (err) {
            setError(
                "Impossible de contacter le serveur. Vérifie ton terminal Laravel.",
            );
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <h1 className="h-20 text-white bg-blue-800 flex items-center justify-center text-xl font-semibold w-full">
                CONNECT'IN
            </h1>

            <div className="flex-1 flex items-center justify-center py-10">
                <div className="bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-800 w-full max-w-md">
                    <h2 className="text-2xl font-extralight text-white mb-6 text-center">
                        Inscription
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-slate-300 text-sm">
                                Nom
                            </label>
                            <input
                                type="text"
                                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Nom"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-slate-300 text-sm">
                                Prénom
                            </label>
                            <input
                                type="text"
                                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Prénom"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-slate-300 text-sm">
                                Email
                            </label>
                            <input
                                type="email"
                                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 "
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemple@email.com"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-slate-300 text-sm">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="mot de passe"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-slate-300 text-sm">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 "
                                value={confirmPassword}
                                required
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="confirmer mot de passe"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 cursor-pointer rounded-lg transition-colors mt-2"
                        >
                            S'inscrire
                        </button>

                        <p
                            className="text-slate-400 text-sm text-center mt-4 cursor-pointer hover:underline"
                            onClick={() => navigation("login")}
                        >
                            Déjà un compte ? Cliquez ici
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
