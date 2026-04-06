// Profil.jsx
import React, { useState, useRef } from "react";
// On importe la mémoire (useState)

export default function Profil({ navigation, user, setUser }) {
    // pour que le nom se modifie
    const [isEditingLastName, setIsEditingLastName] = useState(false);
    const [tempLastName, setTempLastName] = useState(user.last_name);
    // pour le prenom
    const [isEditingFirstName, setIsEditingFirstName] = useState(false);
    const [tempFirstName, setTempFirstName] = useState(user.first_name);
    // pour l'email
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [tempEmail, setTempEmail] = useState(user.email);
    // on utilise le mot de passe pour changer l'email et le mot de passe
    const [verificationPassword, setVerificationPassword] = useState("");
    // pour le mot de passe
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [tempPassword, setTempPassword] = useState("");
    // onconfirme le mot de passe
    const [confirmPassword, setConfirmPassword] = useState("");

    // pour suprimer le compte
    // interrupteur pour afficher la fenêtre "Confirmation de Suppression"
    const [confirmationSuppression, setConfirmationSuppression] =
        useState(false);
    // le choix pour l'option "Anonymisation" (true = supprimer tout / false = anonymiser)
    const [anonymisation, setAnonymisation] = useState(false);
    // autre verification de mot depasse pour le fformulaire de supression de compte
    const [motDePasseSecurite, setMotDePasseSecurite] = useState("");

    // pour la photo
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    // pour la bio
    const [tempBio, setTempBio] = useState(user.bio || "");
    const [isEditingBio, setIsEditingBio] = useState(false);

    //  fonction pour sauvegarder la bio
    async function handleSaveBio() {
        if (isEditingBio) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/users/${user.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                        body: JSON.stringify({ bio: tempBio }),
                    },
                );
                const data = await response.json();

                if (response.ok) {
                    // si bon on enregistre les changement
                    const updatedUser = { ...user, bio: tempBio };
                    setUser(updatedUser);

                    localStorage.setItem(
                        "user_data",
                        JSON.stringify(updatedUser),
                    );

                    setIsEditingBio(false);
                    alert("Bio mise à jour !");
                } else {
                    // si non message d'erreur
                    alert(data.message || "Erreur lors de la modification");
                }
            } catch (error) {
                console.error("Erreur critique :", error);
                alert("Impossible de joindre le serveur.");
            }
        } else {
            setIsEditingBio(true);
        }
    }

    // fonction pour le bouton enregistrement du nouveau nom
    async function handleSaveLastName() {
        if (isEditingLastName) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/users/${user.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                        body: JSON.stringify({
                            last_name: tempLastName,
                        }),
                    },
                );

                const data = await response.json();

                if (response.ok) {
                    // On enregistre les changements pour que seul le nom change
                    setUser({ ...user, last_name: tempLastName });
                    // On ferme l'input
                    setIsEditingLastName(false);
                    alert("Nom mis à jour !");
                } else {
                    // Si le serveur refuse (ex: mauvais MDP)
                    alert(data.message || "Erreur lors de la modification");
                }
            } catch (error) {
                // Si la connexion a échoué (réseau, serveur éteint)
                console.error("Erreur critique :", error);
                alert("Impossible de joindre le serveur.");
            }
        } else {
            // Si c'était fermé, on l'ouvre
            setIsEditingLastName(true);
        }
    }

    // fonction pour le bouton enregistrement du nouveau prenom
    async function handleSaveFirstName() {
        if (isEditingFirstName) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/users/${user.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                        body: JSON.stringify({
                            first_name: tempFirstName,
                        }),
                    },
                );

                const data = await response.json();

                if (response.ok) {
                    // On enregistre les changements pour que seul le prenom change
                    setUser({ ...user, first_name: tempFirstName });
                    // On ferme l'input
                    setIsEditingFirstName(false);
                    alert("Prenom mis à jour !");
                } else {
                    // Si le serveur refuse (ex: mauvais MDP)
                    alert(data.message || "Erreur lors de la modification");
                }
            } catch (error) {
                // Si la connexion a échoué (réseau, serveur éteint)
                console.error("Erreur critique :", error);
                alert("Impossible de joindre le serveur.");
            }
        } else {
            // Si c'était fermé, on l'ouvre
            setIsEditingFirstName(true);
        }
    }

    // fonction pour le bouton enregistrement du nouveau email
    async function handleSaveEmail() {
        if (isEditingEmail) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/users/${user.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            // On récupère le token pour prouver qu'on est connecté
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                        body: JSON.stringify({
                            email: tempEmail,
                            // Le nouvel email que l'on veut enregistrer
                            password: verificationPassword,
                        }),
                    },
                );

                const data = await response.json();

                if (response.ok) {
                    // Si le serveur confirme que tout est OK (Code 200)
                    setUser({ ...user, email: tempEmail });
                    setIsEditingEmail(false);
                    setVerificationPassword("");
                    alert("Email mis à jour avec succès !");
                } else {
                    // Si le serveur renvoie une erreur (ex: Code 401 "Mot de passe incorrect")
                    alert(data.message || "Erreur lors de la mise à jour.");
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
                alert("Impossible de contacter le serveur.");
            }
        } else {
            // Si l'input n'était pas ouvert, on l'affiche
            setIsEditingEmail(true);
        }
    }

    // fonction pour le bouton enregistrement du nouveau mot de passe
    async function handleSavePassword() {
        if (isEditingPassword) {
            // verifie la correspondance entre le mot de passe et la la confirmation mot de passe
            if (tempPassword !== confirmPassword) {
                alert(
                    "Le nouveau mot de passe et sa confirmation ne correspondent pas.",
                );
                return;
            }

            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/users/${user.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                        body: JSON.stringify({
                            password: verificationPassword,
                            // mot de passe actuel (pour le Hash::check)

                            new_password: tempPassword,
                            // le nouveau (à enregistrer)
                            _method: "PUT",
                        }),
                    },
                );

                const data = await response.json();

                if (response.ok) {
                    alert("Mot de passe mis à jour !");
                    setIsEditingPassword(false);
                    setVerificationPassword("");
                    setTempPassword("");
                    setConfirmPassword("");
                } else {
                    alert(data.message || "Erreur lors de la modification");
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
                alert("Impossible de joindre le serveur.");
            }
        } else {
            setIsEditingPassword(true);
        }
    }

    // fonction pour suprimer son compte
    async function handleDeleteAccount() {
        // on vérifie juste que le mot de passe n'est pas vide avant d'envoyer
        if (!motDePasseSecurite) {
            alert("Le mot de passe est obligatoire pour confirmer.");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${user.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    body: JSON.stringify({
                        // Si anonymisation est true, alors delete_content est false
                        delete_content: !anonymisation,
                        password: motDePasseSecurite,
                    }),
                },
            );

            if (response.ok) {
                alert("Compte traité avec succès.");
                localStorage.removeItem("access_token");

                // On ferme le formulaire par sécurité avant de partir
                setConfirmationSuppression(false);

                navigation("login");
            } else {
                // Si le serveur renvoie une erreur (ex: 401 mot de passe incorrect)
                const data = await response.json();
                alert(data.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Impossible de contacter le serveur.");
        }
    }

    // fonction telecharger une image utilisateur
    async function handleImageChange(e) {
        // on recupere le fichier dans l'ordi
        const fichier = e.target.files[0];

        // la fonction ne s'exécute pas si on annule
        if (!fichier) return;

        // sert a transporté les fichierq car json ne peux pas
        const formData = new FormData();
        //  on ajoute l'image a la db
        formData.append("profile_photo", fichier);

        // IMPORTANT : Laravel a besoin de cette ligne pour accepter une modification de fichier en POST
        formData.append("_method", "PUT");

        // On crée une URL temporaire pour que l'utilisateur voie sa photo tout de suite sans attendre le serveur
        const urlTemporaire = URL.createObjectURL(fichier);
        setPreview(urlTemporaire);

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${user.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    body: formData,
                },
            );
            const data = await response.json();

            if (response.ok) {
                // on crée l'objet l'utilisateur mis à jour
                const UptadedUser = {
                    ...user,
                    profile_photo_path: data.user.profile_photo_path,
                };
                // on met à jour le state dans React
                setUser(UptadedUser);
                // on met à jour le localstorage
                localStorage.setItem("user_data", JSON.stringify(UptadedUser));

                // on vide le preview pour  forcer l'affichage de la vraie image
                setPreview(null);
                alert("photo mise à jour avec succes!");
            }
        } catch (error) {
            // si non il y a un message d'erreur
            alert("Une erreur est survenue");
        }
        console.log(user);
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4">
            {/* barre de navigation */}
            <header className="h-20 bg-blue-800 flex items-center justify-around max-md:text-sm text-xl font-bold mb-8 rounded-lg">
                <span
                    onClick={() => navigation("profil")}
                    className="cursor-pointer bg-blue-900 mr-4 hover:bg-blue-700 mr-4 p-2 shadow rounded-full rounded-full"
                >
                    Profil {user.first_name} {user.last_name}
                </span>
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
                    className="mr-4 bg-blue-700 hover:bg-blue-600 p-2 shadow rounded-full cursor-pointer"
                >
                    Déconnexion
                </button>
            </header>
            <div className="max-w-4xl mx-auto ">
                {/* Bannière / Couverture */}
                <div className="h-30 bg-gradient-to-r from-blue-900 to-slate-800 w-full rounded-b-xl"></div>

                {/* Photo de profil  */}
                <div className="px-30 -mt-12 flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className="h-32 w-32 cursor-pointer  border-4 border-slate-950 bg-slate-200 text-black rounded-full flex items-center justify-center overflow-hidden h text-4xl hover:bg-slate-600 font-bold shadow-2xl"
                    >
                        {preview ? (
                            // l'image de profil
                            <img
                                src={preview}
                                className="h-full w-full object-cover"
                                alt="Aperçu"
                            />
                        ) : user.profile_photo_path ? (
                            <img
                                src={`http://127.0.0.1:8000/storage/${user.profile_photo_path}`}
                                className="h-full w-full object-cover"
                                alt="profil"
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/150";
                                }}
                            />
                        ) : (
                            // si pas d'image les initials
                            <span>
                                {user.first_name?.charAt(0).toUpperCase()}
                                {user.last_name?.charAt(0).toUpperCase()}
                            </span>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <div className="flex flex-col justify-end mt-15 flex-1 text-center sm:text-left">
                        <h2 className="text-3xl font-bold">
                            {user.first_name} {user.last_name}
                        </h2>
                    </div>
                </div>
            </div>

            {/* champ pour la bio */}
            <div className="flex   gap gap-2  justify-center">
                <div className="flex flex-col">
                    <span>
                        Ici décrivez vos missions ou vos domaines d'expertise
                    </span>
                    <div className="flex flex-col w-full gap gap-2 justify-center">
                        <textarea
                            placeholder="Ex: Je suis en ......, je m'occupe de ......, je me spécialise en ........."
                            name="bio"
                            id="bio"
                            className="h-content border border-slate-700  bg-slate-900 p-5 w-auto mt-5 rounded"
                            value={tempBio}
                            onChange={(e) => setTempBio(e.target.value)}
                            readOnly={!isEditingBio}
                        ></textarea>

                        {/* bouton pour modifier/enregistrer la bio */}
                        <button
                            onClick={handleSaveBio}
                            className="text-white cursor-pointer hover:text-red-600"
                        >
                            {isEditingBio ? "Enregistrer" : "Modifier"}
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center justify-center">
                <div className="bg-slate-900 items-center justify-center mt-10  p-8 rounded-xl shadow-xl border border-slate-700 w-full max-w-md">
                    <div>
                        {/* champ Nom/ LastName */}
                        <div className="flex justify-between  p-5 items-center border-b border-slate-800">
                            <div className="flex flex-col">
                                <span className="text-slate-400">Nom</span>
                                {isEditingLastName ? (
                                    <div className="flex flex-col gap-2 py-2">
                                        <input
                                            type="text"
                                            value={tempLastName}
                                            onChange={(e) =>
                                                setTempLastName(e.target.value)
                                            }
                                            className="bg-slate-800 text-white p-1 rounded border border-blue-500"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-white">
                                        {user.last_name}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSaveLastName}
                                className="text-white cursor-pointer hover:text-red-600"
                            >
                                {isEditingLastName ? "Enregistrer" : "Modifier"}
                            </button>
                        </div>
                        {/* champ prenom/ FirstName */}
                        <div className="flex justify-between p-5 items-center border-b border-slate-800">
                            <div className="flex flex-col">
                                <span className="text-slate-400">Prénom</span>
                                {isEditingFirstName ? (
                                    <div className="flex flex-col gap-2 py-2">
                                        <input
                                            type="text"
                                            className="bg-slate-800 text-white p-1 rounded border border-blue-500"
                                            value={tempFirstName}
                                            onChange={(e) =>
                                                setTempFirstName(e.target.value)
                                            }
                                        />
                                    </div>
                                ) : (
                                    <span className="text-white">
                                        {user.first_name}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSaveFirstName}
                                className="text-white cursor-pointer hover:text-red-600"
                            >
                                {isEditingFirstName
                                    ? "Enregistrer"
                                    : "Modifier"}
                            </button>
                        </div>
                        {/* champ email */}
                        <div className="flex justify-between p-5 items-center border-b border-slate-800">
                            <div className="flex flex-col">
                                <span className="text-slate-400">Email</span>
                                {isEditingEmail ? (
                                    <div className="flex flex-col gap-2 py-2">
                                        <input
                                            type="text"
                                            className="bg-slate-800 text-white p-1 rounded border border-blue-500"
                                            value={tempEmail}
                                            onChange={(e) =>
                                                setTempEmail(e.target.value)
                                            }
                                        />
                                        {/* securité avec le mot de passe actuel */}
                                        <input
                                            type="password"
                                            placeholder="Mot de passe actuel"
                                            value={verificationPassword}
                                            onChange={(e) =>
                                                setVerificationPassword(
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-slate-800 text-white p-1 rounded border border-blue-500"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-white">
                                        {user.email}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSaveEmail}
                                className="text-white cursor-pointer hover:text-red-600"
                            >
                                {isEditingEmail ? "Enregistrer" : "Modifier"}
                            </button>
                        </div>

                        {/* champ du mot de passe */}
                        <div className="flex justify-between  p-5 items-center">
                            <div className="flex flex-col gap-2">
                                <span className="text-slate-400">
                                    Mot de Passe
                                </span>
                                {isEditingPassword ? (
                                    <div className="flex flex-col gap-2 py-2">
                                        {/* verifie le mot de passe actuel */}
                                        <input
                                            type="password"
                                            placeholder="Mot de passe actuel"
                                            className="bg-slate-800 text-white p-1 rounded border border-blue-500"
                                            value={verificationPassword}
                                            onChange={(e) =>
                                                setVerificationPassword(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {/* le nouveau mot de passe */}
                                        <input
                                            type="password"
                                            placeholder="Nouveau mot de passe"
                                            className="bg-slate-800 text-white p-1 rounded border border-blue-500"
                                            value={tempPassword}
                                            onChange={(e) =>
                                                setTempPassword(e.target.value)
                                            }
                                        />
                                        {/* confirmation du nouveau mot de passe */}
                                        <input
                                            type="password"
                                            placeholder="Confirmer nouveau"
                                            className="bg-slate-800 text-white p-1 rounded border border-blue-500"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                ) : (
                                    <span className="text-white">
                                        **********
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSavePassword}
                                className="text-white cursor-pointer hover:text-red-600"
                            >
                                {isEditingPassword ? "Enregistrer" : "Modifier"}
                            </button>
                        </div>

                        <button
                            // bouton suprimer le compte
                            onClick={() => {
                                setMotDePasseSecurite("");
                                // On repart sur un champ vide
                                setConfirmationSuppression(true);
                            }}
                            className="
                        text-red-600 border justify-center border-slate-600 px-2 bg-slate-300 flex text-center items-center w-50 cursor-pointer rounded mt-3 h-7 hover:text-red-500 hover:bg-slate-200 
                        "
                        >
                            Supprimer le compte
                        </button>
                    </div>
                </div>
            </div>

            {/* on n'affiche que si confirmationSuppression est vrai */}
            {confirmationSuppression && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    {/* le formulaire */}
                    <div className="bg-slate-900 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Confirmation de suppression
                        </h2>

                        <p className="text-white mb-6">
                            Es-tu certain de vouloir quitter Connect'In ? Cette
                            action est irréversible.
                        </p>

                        {/* Anonymisation */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-white mb-2">
                                Que faire de tes posts et commentaires ?
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setAnonymisation(false)}
                                    // false = Tout supprimer
                                    className={`px-4 text-black py-2 rounded-lg border cursor-pointer hover:bg-gray-300  ${!anonymisation ? "bg-red-50 border-red-500 text-red-700" : "bg-white border-gray-300"}`}
                                >
                                    Tout supprimer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAnonymisation(true)}
                                    // true = Anonymiser
                                    className={`px-4 text-black py-2 rounded-lg border cursor-pointer hover:bg-gray-300  ${anonymisation ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-gray-300"}`}
                                >
                                    Anonymiser
                                </button>
                            </div>
                        </div>

                        {/* Section : Sécurité (Mot de passe) */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-white mb-2">
                                Sécurité : Saisis ton mot de passe
                            </label>
                            <input
                                type="password"
                                value={motDePasseSecurite}
                                onChange={(e) =>
                                    setMotDePasseSecurite(e.target.value)
                                }
                                placeholder="••••••••"
                                className="placeholder-gray-500 w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white outline-none"
                            />
                        </div>

                        {/* boutons d'actions finales */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setConfirmationSuppression(false)
                                }
                                // on ferme sans rien changer
                                className="px-4 py-2 text-white cursor-pointer hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                // on suprime tout
                                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 cursor-pointer transition-colors shadow-lg"
                            >
                                Confirmer la suppression
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
