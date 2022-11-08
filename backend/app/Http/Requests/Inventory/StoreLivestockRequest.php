<?php

namespace App\Http\Requests\Inventory;

use App\Rules\Contains;
use Illuminate\Foundation\Http\FormRequest;

class StoreLivestockRequest extends FormRequest
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
			'description' => ['required', 'max:1000'],
			'variety_id' => ['required', 'exists:varieties,id'],
			'sex' => ['optional', 'in:male,female'],
			'date_of_birth' => ['optional', 'date'],
			'parent_id' => ['optional'],
			'quantity' => ['required', 'int'],
			'images.*' => ['string', 'max:1361920', new Contains('data:image/')],
		];
	}

	public function messages()
	{
		return [
			'images.*.max' => 'Maximum image upload size is 1MB',
		];
	}
}
