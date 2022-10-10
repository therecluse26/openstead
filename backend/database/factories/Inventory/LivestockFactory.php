<?php

namespace Database\Factories\Inventory;

use App\Enums\LivestockType;
use App\Models\Inventory\Equipment;
use App\Models\Location;
use App\Models\Variety;
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
			'variety_id' => Variety::where('kingdom', 'animal')->inRandomOrder()->first(),
			'date_of_birth' => fake()->dateTimeThisDecade(),
			'location_id' => Location::inRandomOrder()->first(),
			'quantity' => fake()->numberBetween(0, 10),
			'acquired_at' => fake()->dateTimeThisYear(),
		];
	}
}
