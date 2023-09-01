<?php
namespace App\Repositories\User;

use App\Models\User;
use App\Contracts\Repository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserRepository implements Repository
{
    public function getAuthenticatedUser(): ?User
    {
        return auth()->user();
    }

    public function index()
    {
        return User::all();
    }

    public function getById(string $id): User
    {
        return User::findOrFail($id);
    }

    public function create(array $attributes): User
    {
        return User::create([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'password' => Hash::make($attributes['password']),
            'roles' => $attributes['roles'] ?? null,
            'permissions' => $attributes['permissions'] ?? null,
        ]);
    }

    public function update(string $id, array $attributes): User
    {
        $user = $this->getById($id);
        $user->update($attributes);

        return $user;
    }

    public function delete(string $id): bool
    {
        return $this->getById($id)->delete();
    }

    public function count(): int
    {
        return User::count();
    }

    public function all(): Collection
    {
        return User::all();
    }

    public function getModel(): User
    {
        return new User();
    }

    public function __call(string $method, array $arguments): mixed
    {
        return $this->getModel()->$method(...$arguments);
    }


}