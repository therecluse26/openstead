<?php

namespace Database\Factories;

use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Models\Inventory\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class EquipmentFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		return [
			'name' => fake()->words(3, true),
			'type' => fake()->randomElement(EquipmentType::cases()),
			'condition' => fake()->randomElement(EquipmentCondition::cases()),
			'description' => fake()->paragraph(3)
		];
	}
}
