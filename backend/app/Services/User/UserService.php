<?php
namespace App\Services\User;

use App\Contracts\DataTablePaginatable;
use App\Models\User;
use App\Repositories\User\UserRepository;
use App\Services\DataTableService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use InvalidArgumentException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserService {
    /**
	 * Builds data for inventory Datatable
	 *
	 * @throws JsonException
	 * @throws ReflectionException
	 */
	public static function buildPaginatedTableData(string $model, Request $request): LengthAwarePaginator
	{
		if (!isset(class_implements($model)[DataTablePaginatable::class])) {
			throw new InvalidArgumentException('Given model must implement ' . DataTablePaginatable::class);
		}

		$params = json_decode($request->get('lazyEvent'), false, 512, JSON_THROW_ON_ERROR);

		$params->tenantPivotId = tenant()->id;

		return DataTableService::buildAndExecuteQuery(
			new UserRepository(),
			$params
		);
	}

	public function resetPassword(User $user, string $password){
		$status = Password::reset(
            function () use ($password, $user) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status != Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

		return $status;
	}
}