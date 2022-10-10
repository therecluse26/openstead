<?php

namespace Database\Factories\Inventory;

use App\Enums\PlantType;
use App\Models\Inventory\Equipment;
use App\Models\Location;
use App\Models\Variety;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class SeedFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		return [
			'type' => fake()->randomElement(PlantType::cases()),
			'variety_id' => Variety::where('kingdom', 'plant')->inRandomOrder()->first(),
			'location_id' => Location::inRandomOrder()->first(),
			'quantity' => fake()->numberBetween(0, 10),
			'acquired_at' => fake()->dateTimeThisYear(),
		];
	}
}
