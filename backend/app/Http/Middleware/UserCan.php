<?php

namespace App\Http\Middleware;

use App\Enums\Authorization\Permission;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserCan
{

    private User $authUser;
    
    // Memoize the authenticated user
    private function authUser(): ?User
    {
        if(!isset($this->authUser)) {
            $this->authUser = auth()->user();
        }
        return $this->authUser;
    }

	/**
	 * Handle an incoming request.
	 *
	 * @param Request $request
	 * @param Closure $next
	 * @param string $permission
	 * @return Response
	 */
	public function handle(Request $request, Closure $next, string $permission): Response
	{

        $matchedPermission = Permission::from($permission);

        if(is_null($matchedPermission)) {
            return response()->json(['message' => 'Invalid permission'], 400);
        }

		if (!$this->authUser()?->hasPermissionTo($matchedPermission)) {
			return response()->json(['message' => 'Access denied'], 403);
		}

		return $next($request);
	}

}