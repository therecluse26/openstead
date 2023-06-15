<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class LocationFactory extends Factory
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
	        'description' => fake()->paragraph(2),
	        'address1' => fake()->streetAddress(),
			'city' => fake()->city(),
	        'state' => fake()->stateAbbr(),
	        'zip' => fake()->postcode(),
	        'country' => fake()->countryCode()
        ];
    }
}
