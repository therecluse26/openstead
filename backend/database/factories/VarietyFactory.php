<?php

namespace Database\Factories;

use App\Enums\LivestockType;
use App\Enums\PlantType;
use App\Models\Inventory\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class VarietyFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		$group = fake()->randomElement(['plant', 'animal']);
		return [
			'group' => $group,
			'group_type' => fake()->randomElement(match ($group) {
				'plant' => PlantType::cases(),
				'animal' => LivestockType::cases(),
			}),
			'variety_name' => fake()->words(3, true),
			'description' => fake()->sentence(10, true),
		];
	}
}
