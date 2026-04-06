<?php

namespace App\Interfaces;

interface UserRepositoryInterface 
{
    public function all();                         // Lire tous les utilisateurs
    public function find(int $id);                // Trouver un utilisateur par ID
    public function findByEmail(string $email);   // Trouver par email (pour le login)
    public function create(array $data);           // Créer (Inscription)
    public function update(int $id, array $data);  // Modifier le profil
    public function delete(int $id);               // Supprimer le compte
    public function updateStatus(int $id, int $status); // Gérer is_connected
}