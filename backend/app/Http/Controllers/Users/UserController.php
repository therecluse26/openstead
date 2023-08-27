<?php
namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Resources\Users\List\UserListResource;
use App\Repositories\User\UserRepository;
use App\Resources\Users\Detail\UserWithPermissions;

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

    public function getAuthenticatedUser()
    {
        return new UserWithPermissions(
            $this->repository()->getAuthenticatedUser()
        );
    }

    public function index()
    {
        return UserListResource::collection(
            $this->repository()->index()
        );
    }
}