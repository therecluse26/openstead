<?php

namespace App\Casts;

use App\Enums\LivestockType;
use App\Enums\PlantType;
use App\Models\Variety;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class VarietyType implements CastsAttributes
{
	/**
	 * Cast the given value.
	 *
	 * @param Variety $model
	 * @param string $key
	 * @param mixed $value
	 * @param array $attributes
	 * @return mixed
	 */
	public function get($model, $key, $value, $attributes)
	{
		return match ($model->kingdom) {
			'plant' => PlantType::from($value),
			'animal' => LivestockType::from($value),
		};
	}

	/**
	 * Prepare the given value for storage.
	 *
	 * @param Model $model
	 * @param string $key
	 * @param string $value
	 * @param array $attributes
	 * @return string
	 */
	public function set($model, $key, $value, $attributes)
	{
		return $value;
	}
}