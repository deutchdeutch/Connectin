import { useState, useEffect } from "react";

export default function Accueil({ navigation, user, setUser, setVisitedUser }) {
    const [showForm, setShowForm] = useState(false); // verifie l'etat du formulaire à la base est faux et passe à true si user souhaite créer un post
    const [content, setContent] = useState(""); // lorsque user créer un post , permet d'écrire en temps réel
    const [posts, setPosts] = useState([]); // permet d'afficher tous les posts au démarrage
    const [image, setImage] = useState(null); // permet de gerer l'ajout d'image
    const [commentTexts, setCommentTexts] = useState({}); // Pour stocker le texte de chaque post individuellement
    const [openCommentsPostId, setOpenCommentsPostId] = useState(null); // permet de capsuler tous les commentaires d'un post un clic permet de tous les afficher
    const [searchTerm, setSearchTerm] = useState(""); // permet de gerer la recherche d'un utilisateur
    const [searchResults, setSearchResults] = useState([]); //
    const API_URL = "http://127.0.0.1:8000/api";

    // Récupere les posts depuis L'API LARAVEL
    const fetchPosts = async () => {
        const token = localStorage.getItem("access_token"); //
        console.log("Jeton envoyé :", token);

        try {
            const response = await fetch(`${API_URL}/posts`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setPosts(data);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error("Erreur API :", error);
        }
    };

    // fonction de publication
    const handleCreatePost = async () => {
        if (!content.trim() && !image) {
            alert("Le post est vide !");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        formData.append("user_id", user.id);

        if (image) {
            formData.append("image", image); // Ajoute le fichier image
        }

        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: "POST",
                body: formData,
                headers: {
                    // verifie qui publie grâce au token
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`, // ✅ correction
                    Accept: "application/json",
                },
            });

            const result = await response.json();

            if (response.ok) {
                setContent("");
                setImage(null);
                setShowForm(false);
                fetchPosts(); // Recharge la liste pour voir le nouveau post
            } else {
                alert(
                    "Erreur du serveur : " +
                        (result.message || "Impossible de publier"),
                );
            }
        } catch (error) {
            console.error("Erreur publication :", error);
        }
    };
    // fonction qui permet de rechercher un utilisateur
    const handleSearch = async (val) => {
        setSearchTerm(val);
        if (val.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/users/search?q=${val}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Erreur recherche:", error);
        }
    };
    // fonction qui permet de pouvoir commenter un post
    const handleAddComment = async (postId) => {
        const text = commentTexts[postId];
        if (!text) return;

        try {
            const response = await fetch(`${API_URL}/comments`, {
                //
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    content: text,
                    post_id: postId,
                    user_id: user.id,
                }),
            });

            if (response.ok) {
                setCommentTexts({ ...commentTexts, [postId]: "" }); // Vide le champ
                fetchPosts(); // Rafraîchit pour voir le commentaire apparaître
            }
        } catch (error) {
            console.error("Erreur commentaire :", error);
        }
    };

    // fonction qui permet de liker un post
    const handleToggleLike = async (postId) => {
        try {
            const response = await fetch(`${API_URL}/likes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({ post_id: postId }),
            });

            if (response.ok) {
                fetchPosts(); // recharger pour mettre à jour le compteur
            }
        } catch (error) {
            console.error("Erreur like :", error);
        }
    };
    // Suppression de commentaire
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Supprimer ce commentaire ?")) return;
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (response.ok) fetchPosts();
        } catch (error) {
            console.error("Erreur suppression :", error);
        }
    };

    // Modification des commentaires
    const handleUpdateComment = async (commentId, newContent) => {
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "PUT", // Important : méthode PUT pour la mise à jour
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({ content: newContent }),
            });
            if (response.ok) fetchPosts();
        } catch (error) {
            console.error("Erreur modification :", error);
        }
    };
    // Fonction pour supprimer un post
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                alert("Post supprimé avec succès !");
                fetchPosts(); // Recharge la liste
            } else {
                const result = await response.json();
                alert(result.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Erreur suppression post:", error);
            alert("Erreur réseau");
        }
    };

    // Fonction pour modifier un post
    const handleUpdatePost = async (postId, currentContent) => {
        const newContent = window.prompt("Modifier le post :", currentContent);

        if (!newContent || newContent.trim() === "") {
            return; // Annulé ou vide
        }

        try {
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({ content: newContent }),
            });

            if (response.ok) {
                alert("Post modifié avec succès !");
                fetchPosts(); // Recharge la liste
            } else {
                const result = await response.json();
                alert(result.message || "Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur modification post:", error);
            alert("Erreur réseau");
        }
    };

    // Charger les posts automatiquement quand on arrive sur la page
    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLogout = () => {
        // supprime le token du navigateur
        localStorage.removeItem("access_token");

        if (setUser) {
            setUser({ first_name: "", last_name: "", email: "" });
        }

        navigation("login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4">
            {/* Header */}
            <header className="h-20 bg-blue-800 flex items-center justify-around max-md:text-sm text-xl font-bold mb-8 rounded-lg">
                <span
                    onClick={() => navigation("profil")}
                    className="cursor-pointer mr-4 bg-blue-700 hover:bg-blue-600 p-2 shadow rounded-full"
                >
                    Profil {user.first_name} {user.last_name}
                </span>
                <span
                    onClick={() => navigation("accueil")}
                    className="cursor-pointer bg-blue-900 mr-4 hover:bg-blue-700 p-2 shadow rounded-full"
                >
                    CONNECT'IN
                </span>
                <button
                    onClick={() => {
                        localStorage.removeItem("access_token");
                        setUser?.({ first_name: "", last_name: "", email: "" });
                        navigation("login");
                    }}
                    className="cursor-pointer mr-4 bg-blue-700 hover:bg-blue-600 p-2 shadow rounded-full"
                >
                    Déconnexion
                </button>
            </header>

            <main className="max-w-2xl mx-auto space-y-6">
                {/* Barre de recherche */}
                <div className="flex gap-4 items-center">
                    <label className="text-white font-semibold">
                        Recherche
                    </label>
                    <div className="relative flex-1">
                        <input
                            className="w-full rounded-full px-4 py-2 bg-white text-black"
                            placeholder="Rechercher un utilisateur..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute top-full w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl mt-1 z-[9999]">
                                {searchResults.map((u) => (
                                    <div
                                        key={u.id}
                                        className="p-3 hover:bg-slate-800 cursor-pointer flex items-center gap-3"
                                    >
                                        <img
                                            src={
                                                u.profile_photo_url ||
                                                "https://via.placeholder.com/40"
                                            }
                                            className="w-10 h-10 rounded-full"
                                            alt="avatar"
                                        />
                                        <span
                                            onClick={() => {
                                                setVisitedUser(u);
                                                navigation("ProfilPublic");
                                            }}
                                        >
                                            {u.full_name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-white text-black px-6 py-2 cursor-pointer rounded-lg font-bold hover:bg-gray-200"
                    >
                        {showForm ? "ANNULER" : "CRÉER POST"}
                    </button>
                </div>

                {/* Formulaire création post */}
                {showForm && (
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                        <textarea
                            className="w-full p-4 rounded-lg bg-slate-800 text-white border border-slate-700 resize-vertical min-h-[100px]"
                            placeholder="Quoi de neuf aujourd'hui ?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <button
                            onClick={handleCreatePost}
                            className="w-full bg-blue-600 py-3 cursor-pointer rounded-lg font-semibold text-white hover:bg-blue-700"
                        >
                            Publier
                        </button>
                    </div>
                )}

                {/* Feed des posts */}
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:shadow-xl transition-all"
                        >
                            {/* Header post */}
                            <div className="flex items-center gap-3 mb-3">
                                {post.user?.avatar && (
                                    <img
                                        src={post.user.avatar}
                                        alt="Avatar"
                                        className="w-12 h-12 rounded-full border-2 border-blue-500"
                                    />
                                )}
                                <div>
                                    <h3 className="font-bold text-blue-400">
                                        {post.user?.name ||
                                            "Utilisateur supprimé"}
                                    </h3>
                                    <div className="text-xs text-slate-400">
                                        {post.created_at}
                                    </div>
                                </div>
                            </div>
                            {/*  BOUTONS MODIFIER / SUPPRIMER (seulement si c'est mon post) */}
                            {post.user?.id === user.id && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleUpdatePost(
                                                post.id,
                                                post.content,
                                            )
                                        }
                                        className="text-green-400 px-3 py-1 cursor-pointer rounded-lg border border-green-400 hover:bg-green-400 hover:text-black transition-all text-sm font-semibold"
                                        title="Modifier le post"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeletePost(post.id)
                                        }
                                        className="text-red-400 px-3 py-1 cursor-pointer rounded-lg border border-red-400 hover:bg-red-400 hover:text-white transition-all text-sm font-semibold"
                                        title="Supprimer le post"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}

                            {/* Contenu */}
                            <p className="text-slate-300 mb-4 leading-relaxed">
                                {post.content}
                            </p>
                            {post.image_path && (
                                <img
                                    src={post.image_path}
                                    alt="Post"
                                    className="w-full max-h-64 object-cover  rounded-lg mb-4"
                                />
                            )}

                            {/* Actions */}
                            <div className="flex gap-6 pt-4 border-t border-slate-700 text-sm text-slate-400">
                                <button
                                    onClick={() => handleToggleLike(post.id)}
                                    className="hover:text-white cursor-pointer flex items-center gap-1"
                                >
                                    👍 {post.likes_count ?? 0} Likes
                                </button>
                                <button
                                    onClick={() =>
                                        setOpenCommentsPostId(
                                            openCommentsPostId === post.id
                                                ? null
                                                : post.id,
                                        )
                                    }
                                    className="hover:text-white cursor-pointer flex items-center gap-1"
                                >
                                    💬 {post.comments_count ?? 0} Commentaires
                                </button>
                            </div>

                            {/* Commentaires (conditionnel) */}
                            {openCommentsPostId === post.id && (
                                <div className="mt-4 space-y-2">
                                    {/* Liste commentaires */}
                                    {post.comments?.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="bg-slate-800 p-3 rounded-lg group hover:bg-slate-700 transition-colors"
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-blue-400">
                                                        {comment.user?.name ||
                                                            "Utilisateur supprimé"}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {comment.created_at}
                                                    </span>
                                                </div>
                                                <span className="flex-1 text-left ml-2 text-slate-200">
                                                    {comment.content}
                                                </span>
                                                {/* Actions (seulement si c'est mon commentaire) */}
                                                {comment.user?.id ===
                                                    user.id && (
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => {
                                                                const nouveauTexte =
                                                                    window.prompt(
                                                                        "Modifier :",
                                                                        comment.content,
                                                                    );
                                                                if (
                                                                    nouveauTexte?.trim()
                                                                ) {
                                                                    handleUpdateComment(
                                                                        comment.id,
                                                                        nouveauTexte,
                                                                    );
                                                                }
                                                            }}
                                                            className="text-green-400 cursor-pointer hover:text-green-400 p-1 rounded"
                                                            title="Modifier"
                                                        >
                                                            modifier
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment.id,
                                                                )
                                                            }
                                                            className="text-red-400 cursor-pointer hover:text-red-300 p-1 rounded"
                                                            title="Supprimer"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )) || (
                                        <p className="text-slate-500 text-sm italic">
                                            Aucun commentaire...
                                        </p>
                                    )}

                                    {/* Formulaire nouveau commentaire */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                                        <input
                                            type="text"
                                            className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ajouter un commentaire..."
                                            value={commentTexts[post.id] || ""}
                                            onChange={(e) =>
                                                setCommentTexts({
                                                    ...commentTexts,
                                                    [post.id]: e.target.value,
                                                })
                                            }
                                        />
                                        <button
                                            onClick={() =>
                                                handleAddComment(post.id)
                                            }
                                            disabled={
                                                !commentTexts[post.id]?.trim()
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-gray-600 px-6 py-2 rounded-lg text-sm font-semibold whitespace-nowrap disabled:cursor-not-allowed transition-colors"
                                        >
                                            Envoyer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <p>
                            Aucun post pour le moment. Soyez le premier à
                            publier !
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
