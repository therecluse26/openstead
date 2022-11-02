<?php

namespace App\Http\Requests\Inventory;

use App\Enums\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreServiceLogRequest extends FormRequest
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
			'serviceable_type' => ['required', 'string'],
			'serviceable_id' => ['required', 'integer'],
			'type' => ['required', new Enum(ServiceType::class)],
			'notes' => ['string', 'max:2000'],
			'service_date' => ['date']
		];
	}

}