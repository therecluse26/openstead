<?php

namespace Database\Factories;

use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inventory>
 */
class LocationInventoryFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		$inventoriable = $this->inventoriable();

		return [
			'location_id' => Location::inRandomOrder()->first(),
			'quantity' => fake()->numberBetween(0, 10),
			'acquired_at' => fake()->dateTimeThisDecade(),
			'inventoriable_id' => $inventoriable::factory(),
			'inventoriable_type' => $inventoriable,
		];
	}

	public function inventoriable()
	{
		return $this->faker->randomElement([
			Equipment::class,
			Livestock::class,
		]);
	}
}
