<?php
namespace App\Repositories\User;

use App\Models\User;
use App\Contracts\Repository;
use App\Traits\AddMedia;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserRepository implements Repository
{
    use AddMedia;

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
        $user = User::create([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'password' => Hash::make($attributes['password']),
            'roles' => $attributes['roles'] ?? null,
            'permissions' => $attributes['permissions'] ?? null,
        ]);

        if (isset($attributes['images']) && is_array($attributes['images']) && count($attributes['images']) > 0) {
			$this->addOrReplaceImagesBase64($user, $attributes['images']);
		}

        return $user;
    }

    public function update(string $id, array $attributes): User
    {
        $user = $this->getById($id);
        if($user->name !== $attributes['name']) {
            $user->name = $attributes['name'];
        }

        if($user->email !== $attributes['email']) {
            $user->email = $attributes['email'];
        }

        if(isset($attributes['password'])) {
            $user->password = Hash::make($attributes['password']);
        }

        if(isset($attributes['roles'])) {
            $user->roles = $attributes['roles'];
        }

        if(isset($attributes['permissions'])) {
            $user->permissions = $attributes['permissions'];
        }

        $user->save();

        
        if (isset($attributes['images']) && is_array($attributes['images']) && count($attributes['images']) > 0) {
			$this->addOrReplaceImagesBase64($user, $attributes['images']);
		}

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