<?php

namespace App\Casts;

use App\Enums\AnimalType;
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
		return match ($model->group) {
			'plant' => PlantType::from($value),
			'animal' => AnimalType::from($value),
			'edible' => PlantType::cases()[0]
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