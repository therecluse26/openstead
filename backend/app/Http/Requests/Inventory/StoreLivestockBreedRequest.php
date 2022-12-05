<?php

namespace App\Http\Requests\Inventory;

use App\Enums\AnimalType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreLivestockBreedRequest extends FormRequest
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
			'group' => ['required', 'in:animal'],
			'group_type' => ['required', new Enum(AnimalType::class)],
			'variety_name' => ['required', 'string', 'max:50'],
			'description' => ['required', 'string', 'max:1000']
		];
	}
}
