<?php

namespace App\Http\Requests\User;

use App\Rules\Contains;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		return [
			'name' => 'required',
			'email' => 'required|email|unique:users,email',
			'password' => [
				'required', 
				'confirmed',
				Password::min(10)
					->letters()
					->mixedCase()
					->numbers()
					->symbols()
					->uncompromised(),
			],
			'roles' => 'required|array',
			'permissions' => 'nullable|array',
			'images.*' => ['string', 'max:1361920', new Contains('data:image/')],
		];
	}

	public function messages()
	{
		return [
			'password.min' => 'Password must be at least 10 characters',
			'password.letters' => 'Password must contain at least one letter',
			'password.mixed_case' => 'Password must contain both upper and lower case letters',
			'password.numbers' => 'Password must contain at least one number',
			'password.symbols' => 'Password must contain at least one symbol',
			'password.uncompromised' => 'Password has been compromised',
			'images.*.max' => 'Maximum image upload size is 1MB',
		];
	}
}
