<?php
namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Resources\Users\List\UserListResource;
use App\Repositories\User\UserRepository;

class UserController extends Controller
{
    private UserRepository $repository;

    // Memoize the repository
    public function repository()
    {
        if (!isset($this->repository)) {
            $this->repository = new UserRepository();
        }

        return $this->repository;
    }

    public function index()
    {
        return UserListResource::collection(
            $this->repository()->index()
        );
    }
}