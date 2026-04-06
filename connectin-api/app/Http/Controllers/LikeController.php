<?php
// LikeController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // On ajoute ça pour aider l'IDE
use App\Interfaces\LikeRepositoryInterface;
use App\Models\Like;


class LikeController extends Controller
{
    
    public function __construct(private LikeRepositoryInterface $likes)
{
}   // Liste tous les likes d'un post spécifique
    public function index($post_id) {
        // On récupère tous les likes liés à ce post
        // On peut charger les infos de l'utilisateur avec (si défini dans le repo)
        
        $allLikes = $this->likes->getByPost($post_id);

        if ($allLikes->isEmpty()) {
            return response()->json(['message' => 'Aucun like pour ce post'], 200);
        }

        return response()->json([
            'count' => $allLikes->count(),
            'likes' => $allLikes
        ], 200);
    }

    // Fonction de sauvegarde et de supression du like
    public function save(Request $request) {
        

        $request->validate([
        'post_id' => 'required|exists:posts,id', 
        ]);

        $user_id = Auth::id();
        $post_id = $request->input('post_id');

        $existingLike = Like::where([
            'user_id' => $user_id, 
            'post_id' => $post_id])->first();

        if ($existingLike) {
            $this->likes->deleteSpecific($post_id, $user_id);
            return response()->json(['message' => 'Like retiré'], 200);
        // 200 code de succés 
        }    

        $this->likes->create([
            'user_id' => $user_id, 
            'post_id' => $post_id]);
        return response()->json(['message' => 'C\'est Liké!'], 201);
        // erreur 201 est Quand un utilisateur poste un Commentaire ou un Like.
        }


    // Fonction de supression du like
    public function delete($id) {
        $like = $this->likes->find($id);

        // Vérifie si le like existe (pour éviter un crash)
        if (!$like) {
            return response()->json(['message' => 'Like introuvable'], 404);
            // erreur 404 Si on cherche un like qui n'existe plus.
        }

        if ($like->user_id !== Auth::id()) {
        return response()->json(['message' => 'Attention tu essais de suprimmer le like d\'un autre utilisateur'], 403);
        // erreur 403 est Si un utilisateur tente de supprimer le like d'un autre.
        }
        $this->likes->delete($id); 
         
        
        return response()->json(['message' => 'Like supprimé avec succès !'], 200);
    }
        // 200 = Succès 
}

