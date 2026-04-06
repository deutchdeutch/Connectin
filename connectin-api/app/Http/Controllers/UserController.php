<?php
// UserController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // On ajoute ça pour aider l'IDE
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    public function __construct(private UserRepositoryInterface $users) {}
    // Inscription d'un nouvel utilisateur
    public function add(Request $request)
    {

        // Validation stricte des données
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'email'      => 'required|email|unique:users,email',
            // Vérifie que l'email n'existe pas déjà
            'password'   => 'required|string|confirmed',
            // Nécessite un champ password_confirmation
        ]);

        // Création de l'utilisateur via le Repository
        $user = $this->users->create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'password'   => bcrypt($validated['password']),
            // Toujours crypter le mot de passe !
        ]);

        // Réponse
        return response()->json([
            'message' => 'Bienvenue parmi nous ! Ton compte a été créé.',
            'user'    => [
                'id'    => $user->id,
                'email' => $user->email
            ]
        ], 201); // 201 = Créé avec succès
    }
    // permettre à n'importe quel utilisateur de voir le profil d'un autre membre
    public function show($id)
    {
        $user = $this->users->find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
            // erreur 404 Si on cherche un utilisateur qui n'existe plus.
        }

        return response()->json($user, 200);
        //  200 = succés
    }


    // permet à l'utilisateur de modifier son profil
    public function update(Request $request, $id)
    {

        $user = $this->users->find($id);
        // on recherche l'utilisateur
        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
            // erreur 404 Si on cherche un utilisateur qui n'existe plus.
        }


        //  si un utilisaseur tente de modifier le profil d'un autre
        
        if (Auth::id() !== (int)$id) {
            return response()->json(['message' => 'C\'est le profil d\'un autre utilisateur'], 403);
        }

        //  si on change le mot de passe ou l'email
        if( $request->hasAny(['new_password', 'email'])){
            
            // Vérifie le mot de passe UNIQUEMENT SI l'utilisateur veut changer des données sensibles"
            if (!Hash::check($request->input('password'), $user->password)) {
                return response()->json([
                    'message' => 'Mot de passe actuel incorrect'
                ], 401);
        }}
        
        // validation de l'image
        $request->validate([
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'bio' => 'nullable|string|max:2000',
        ]);
        // ce que l'utilisateur peut modifier
        $data = [];

        if ($request->filled('first_name')) $data['first_name'] = $request->input('first_name');
        if ($request->filled('last_name'))  $data['last_name']  = $request->input('last_name');
        if ($request->filled('email'))      $data['email']      = $request->input('email');
        // j'ai mit has au lieu de filled pour que l'utilisateur puisse faire une bio vide
        if ($request->has('bio')) {
        $data['bio'] = $request->input('bio');
        }

        //  Gestion de l'upload
        if ($request->hasFile('profile_photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }
            // Stocker la nouvelle
            $path = $request->file('profile_photo')->store('avatars', 'public');
            $data['profile_photo_path'] = $path;
        }

        // mise a jour du nouveau mot de passe apres l'avoir modifier
        if ($request->filled('new_password')) {
            $data['password'] = bcrypt($request->input('new_password'));
        }
        // mise a jour du profil
        $this->users->update($id, $data);
        // On recharge l'utilisateur pour renvoyer la nouvelle URL de photo
        $userUpdated = $this->users->find($id);

        return response()->json([
            'message' => 'Profil mis à jour !',
            'user' => $userUpdated
        ], 200);
        // 200 = succés
    }

    // fonction de supression de compte
    public function delete(Request $request, $id)
    {
        $user = $this->users->find($id);


        // on recherche l'utilisateur
        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
            // erreur 404 Si on cherche un utilisateur qui n'existe plus.
        }
        // verifie si on a le bon mot de passe
        if (!Hash::check($request->input('password'), $user->password)) {
        return response()->json([
            'message' => 'Mot de passe incorrect. Suppression annulée.'
        ], 401); 
        // 401 = Non autorisé
        }

        //  si un utilisaseur tente de suprimer le profil d'un autre on vérifie que c'est bien SON profil
        if (Auth::id() !== (int)$id) {
            return response()->json(['message' => 'C\'est le profil d\'un autre utilisateur'], 403);
        }

        // supression de tous les likes
        $user->likes()->delete();

        //  Récupérer le choix de l'utilisateur pour les commentaire et post
        $doitToutSupprimer = $request->input('delete_content'); // oui ou non

        if ($doitToutSupprimer) {
            // CAS 1 : On supprime tous, le profil, les posts et les commentaires
            $user->posts()->delete();
            $user->comments()->delete();
            $this->users->delete($id);
            return response()->json(['message' => 'Compte et contenus associés supprimés'], 200);
        } else {
            // CAS 2 : On met en anonyme les posts et les commentaires
            
            $user->update([
            'first_name' => 'Utilisateur',
            'last_name'  => 'supprimé',
            'profile_photo_path' => null, // On vide le lien vers la photo
            'email'      => 'anon_' . uniqid() . '@connectin.com', // Libère l'email
            'password'   => bcrypt(uniqid()), 
            // Sécurise le compte
        ]);

            return response()->json(['message' => 'Compte anonymisé, contenus conservés'], 200);
        }
    }
    // founction qui permet de rechercher un utilisateur 
   public function search(Request $request)
{
    $query = $request->input('q');
    $users = User::where('first_name', 'LIKE', "%{$query}%")
                ->orWhere('last_name', 'LIKE', "%{$query}%")
                ->orWhere('email', 'LIKE', "%{$query}%")
                ->limit(5)
                ->get(); // Récupère les objets pour utiliser les accesseurs

    return response()->json($users);
}
}
