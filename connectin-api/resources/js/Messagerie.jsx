import React, { useState, useEffect } from "react";

export default function Messagerie({ user, userVisite, navigation }) {
    const [message, setMessage] = useState("");
    const [listeMessages, setListeMessages] = useState([]);

    // ---  CHARGER LES MESSAGES AU DÉBUT ---
    useEffect(() => {
        if (userVisite) {
            fetch(`http://127.0.0.1:8000/api/messages/${userVisite.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    Accept: "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => setListeMessages(data))
                .catch((err) =>
                    console.error("Erreur chargement messages:", err),
                );
        }
    }, [userVisite]);

    // ---  ENVOYER ET SAUVEGARDER ---
    const handleSend = async (e) => {
        e.preventDefault();
        if (message.trim() === "") return;

        try {
            const response = await fetch("http://127.0.0.1:8000/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    receiver_id: userVisite.id,
                    content: message,
                }),
            });

            if (response.ok) {
                const nouveauMsg = await response.json();
                // On ajoute le message retourné par Laravel à l'écran
                setListeMessages([...listeMessages, nouveauMsg]);
                setMessage("");
            }
        } catch (err) {
            console.error("Erreur envoi:", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Header */}
            <div className="h-16 bg-blue-800 flex items-center px-4 shadow-lg sticky top-0 z-10">
                <button
                    onClick={() => navigation("ProfilPublic")}
                    className="mr-4 bg-blue-700 hover:bg-blue-600 p-2 shadow cursor-pointer rounded-full"
                >
                    ← Retour
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold uppercase">
                        {userVisite?.first_name?.charAt(0)}
                    </div>
                    <span className="font-semibold">
                        {userVisite?.first_name} {userVisite?.last_name}
                    </span>
                </div>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
                {listeMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-md ${
                                msg.sender_id === user.id
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-slate-800 text-slate-200 rounded-tl-none"
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2"
            >
                <input
                    type="text"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Écrivez votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                    ✈️
                </button>
            </form>
        </div>
    );
}
