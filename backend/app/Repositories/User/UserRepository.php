<?php
namespace App\Repositories\User;

use App\Models\User;

class UserRepository 
{
    public function index()
    {
        return User::all();
    }
}