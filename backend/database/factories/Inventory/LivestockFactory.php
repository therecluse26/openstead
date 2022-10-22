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
			'variety_id' => Variety::where('kingdom', 'animal')->whereIn('group_type', LivestockType::cases())->inRandomOrder()->first(),
			'sex' => fake()->randomElement(['male', 'female']),
			'date_of_birth' => fake()->dateTimeThisDecade(),
			'location_id' => Location::inRandomOrder()->first(),
			'quantity' => fake()->numberBetween(0, 10),
			'acquired_at' => fake()->dateTimeThisYear(),
		];
	}
}
