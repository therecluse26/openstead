<?php

namespace App\Http\Requests\Inventory;

use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Rules\Contains;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateEquipmentRequest extends FormRequest
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
			'type' => ['required', new Enum(EquipmentType::class)],
			'condition' => ['required', new Enum(EquipmentCondition::class)],
			'quantity' => ['required', 'integer', "min:0"],
			'images' => ['array'],
			'url' => ['active_url'],
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
