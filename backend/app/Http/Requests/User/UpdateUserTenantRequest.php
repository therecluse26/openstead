<?php

namespace App\Http\Requests\User;

use App\Repositories\User\UserRepository;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserTenantRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		dd($this->user, $this->tenant);

		// Check if user is assigned to requested tenant
		return (new UserRepository())->checkUserTenantMembership($this->user, $this->tenant);
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		return [
			'user' => ['required', 'exists:users,id'],
			'tenant' => ['required', 'exists:tenants,id'],
		];
	}
}
