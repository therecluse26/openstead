<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\Livestock;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
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
