<?php

namespace App\Http\Requests\Inventory;

use App\Enums\HardinessZone;
use App\Enums\PlantLifeCycle;
use App\Enums\PlantLightRequirement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreSeedRequest extends FormRequest
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
			'variety_id' => 'required',
			'quantity' => ['required', 'int'],
			'life_cycle' => ['nullable', new Enum(PlantLifeCycle::class)],
			'light_requirement' => ['nullable', new Enum(PlantLightRequirement::class)],
			'zone_lower' => ['nullable', new Enum(HardinessZone::class)],
			'zone_upper' => ['nullable', new Enum(HardinessZone::class)],
			'days_to_germination' => ['nullable', 'int'],
			'days_to_maturity' => ['nullable', 'int'],
			'planting_depth' => ['nullable', 'numeric'],
			'plant_spacing' => ['nullable', 'numeric'],
			'url' => ['nullable', 'string'],
			'acquired_at' => ['nullable', 'date'],
		];
	}
}
