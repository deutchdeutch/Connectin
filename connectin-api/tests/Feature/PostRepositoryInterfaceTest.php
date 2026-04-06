<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Interfaces\PostRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test; // Pour corriger le WARN de PHPUnit 11

class PostRepositoryInterfaceTest extends TestCase
{
    use RefreshDatabase;

    protected $postRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->postRepository = app(PostRepositoryInterface::class);
    }

    #[Test] // Utilisation de l'attribut au lieu de /** @test */
    public function it_should_create_a_new_post_in_database()
    {
        //  ARRANGEMENT : Créer un vrai utilisateur via sa Factory
        $user = User::factory()->create();
        $user = User::factory()->create([
        'first_name' => 'Aurelien',
        'last_name' => 'D' 
    ]);

        $postData = [
            
            'content' => 'Ceci est un test de contenu pour notre API.',
            'user_id' => $user->id, // On utilise l'ID généré dynamiquement
        ];

        //  ACTION
        $createdPost = $this->postRepository->create($postData);

        //  ASSERTION
        $this->assertInstanceOf(Post::class, $createdPost);
        $this->assertDatabaseHas('posts', [
            'content'   => 'Ceci est un test de contenu pour notre API.',
            'user_id' => $user->id
        ]);
    }

    #[Test]
     public function it_should_update_an_existing_post()
    {
    //  ARRANGEMENT
    $user = User::factory()->create(['first_name' => 'Aurelien']);
    // On crée un post initial
    $post = Post::create([
        'content' => 'Ancien contenu',
        'user_id' => $user->id
    ]);

    $updatedData = [
        'content' => 'Contenu mis à jour par le test'
    ];

    //  ACTION
    $updatedPost = $this->postRepository->update($post->id, $updatedData);

    //  ASSERTION
    $this->assertEquals('Contenu mis à jour par le test', $updatedPost->content);
    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'content' => 'Contenu mis à jour par le test'
    ]);
    }

    #[Test]
   public function it_should_delete_a_post()
   {
    //  ARRANGEMENT
    $user = User::factory()->create(['first_name' => 'Aurelien']);
    $post = Post::create([
        'content' => 'Post à supprimer',
        'user_id' => $user->id
    ]);

    //  ACTION
    $this->postRepository->delete($post->id);

    //  ASSERTION
    // On vérifie que la ligne n'existe plus dans la table 'posts'
    $this->assertDatabaseMissing('posts', [
        'id' => $post->id
    ]);
   }
}
