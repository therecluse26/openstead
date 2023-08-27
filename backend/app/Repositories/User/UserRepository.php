<?php
namespace App\Repositories\User;

use App\Models\User;

class UserRepository 
{
    public function getAuthenticatedUser(): ?User
    {
        return auth()->user();
    }

    public function index()
    {
        return User::all();
    }
}