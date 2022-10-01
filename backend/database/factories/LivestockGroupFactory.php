<?php

namespace Database\Factories;

use App\Enums\LivestockType;
use App\Models\Inventory\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class LivestockGroupFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		return [
			'name' => fake()->text(20),
			'type' => fake()->randomElement(LivestockType::cases()),
			'description' => fake()->paragraph(3)
		];
	}
}
