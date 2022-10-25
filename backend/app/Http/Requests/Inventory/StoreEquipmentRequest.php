<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipmentRequest extends FormRequest
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
//			'name' => 'required',
//			'type' => ['required', new Enum(EquipmentType::class)],
//			'condition' => ['required', new Enum(EquipmentCondition::class)],
//			'location' => 'required',
//			'quantity' => ['required', 'integer', "min:0"],
//			'images' => ['']
		];
	}
}
