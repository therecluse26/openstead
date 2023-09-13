<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ListUserRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\UpdateUserTenantRequest;
use App\Models\User;
use App\Resources\Users\List\UserListResource;
use App\Repositories\User\UserRepository;
use App\Resources\Users\Detail\UserDetailResource;
use App\Resources\Users\List\PaginatedUserResource;
use App\Resources\Users\Detail\UserWithPermissions;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    private UserRepository $repository;

    // Memoize the repository
    public function repository(): UserRepository
    {
        if (!isset($this->repository)) {
            $this->repository = new UserRepository();
        }

        return $this->repository;
    }

    public function getAuthenticatedUser(): JsonResponse
    {
        return response()->json(
            UserWithPermissions::make(
                $this->repository()->getAuthenticatedUser()
            ),
            200
        );
    }

    public function index(): JsonResponse
    {
        return response()->json(
            UserListResource::collection(
                $this->repository()->index()
            ),
            200
        );
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(
            UserDetailResource::make(
                $this->repository()->getById($id)
            ),
            200
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        return response()->json(
            UserWithPermissions::make(
                $this->repository()->create($request->all())
            ),
            201
        );
    }

    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        return response()->json(
            UserWithPermissions::make(
                $this->repository()->update($id, $request->all())
            ),
            200
        );
    }

    public function updateCurrentTenant(UpdateUserTenantRequest $request)
    {
        return response()->json(
            UserWithPermissions::make(
                $this->repository()->updateCurrentTenant($request->user, $request->tenant)
            ),
            200
        );
    }

    public function destroy(string $id): JsonResponse
    {
        return response()->json($this->repository()->delete($id), 204);
    }

    public function paginated(ListUserRequest $request, UserService $service): JsonResponse
    {
        return response()->json(
            PaginatedUserResource::make(
                $service::buildPaginatedTableData(User::class, $request),
            ),
            200
        );
    }
}
