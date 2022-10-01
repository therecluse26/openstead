<?php

namespace Database\Factories;

use App\Enums\LivestockType;
use App\Models\Inventory\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class LivestockFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		return [
			'name' => fake()->name(),
			'type' => fake()->randomElement(LivestockType::cases()),
			'breed' => fake()->text(20),
			'date_of_birth' => fake()->dateTimeThisDecade()
		];
	}
}
