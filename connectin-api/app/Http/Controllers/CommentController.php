<?php
// CommentController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // On ajoute ça pour aider l'IDE
use App\Interfaces\CommentRepositoryInterface;
use App\Models\Comment;


class CommentController extends Controller
{
    public function __construct(private CommentRepositoryInterface $comments) {}

    // Afficher tous les commentaires d'un post
    public function index($post_id) {
        $allComments = $this->comments->getByPost($post_id);
        
        return response()->json($allComments, 200);
    }

    // Modifier un commentaire existant
    public function update(Request $request, $id) {
        $comment = $this->comments->find($id);

        //  Vérification d'existence
        if (!$comment) {
            return response()->json(['message' => 'Commentaire introuvable'], 404);
        }

        //  Vérification d'autorisation (Seul l'auteur peut modifier)
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Modification interdite'], 403);
        }

        //  Validation du nouveau contenu
        $validated = $request->validate([
            'content' => 'required|string|max:500'
        ]);

        //  Mise à jour
        $this->comments->update($id, [
            'content' => $validated['content']
        ]);

        return response()->json(['message' => 'Commentaire modifié !'], 200);
    }

    // Fonction de sauvegarde du commentaire
    public function save(Request $request) {
       $validated = $request->validate([
            'content' => 'required|string',
            'post_id' => 'required|exists:posts,id'
        ]);
        
    // Creation du commentaire
        $comment = Comment::create([
            'content' => $validated['content'],
            'post_id' => $validated['post_id'],
            'user_id' => Auth::id()
        ]);
        
        return response()->json($comment, 201);
        // erreur 201 est Quand un utilisateur poste un Commentaire ou un Like.
    }
   
    // Fonction de supression du commentaire 
    public function delete($id) {
        $comment = $this->comments->find($id);

        //  Vérifie si le commentaire existe (pour éviter un crash)
        if (!$comment) {
            return response()->json(['message' => 'Commentaire introuvable'], 404);
            // erreur 404Si on cherche un commentaire qui n'existe plus.
        }

        if ($comment->user_id !== Auth::id()) {
        return response()->json(['message' => 'Attention tu essais de suprimmer le commentaire d\'un autre utilisateur'], 403);
        // erreur 403 est Si un utilisateur tente de supprimer le post d'un autre.
        }
        
         
        
        $this->comments->delete($id);
        return response()->json(['message' => 'Commentaire supprimé avec succé!'], 200);
        // 200 = Succès 
        
             
    
}
}