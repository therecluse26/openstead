<?php

namespace Database\Factories;

use App\Models\Inventory\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class ImageFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		return [
			'url' => fake()->imageUrl(),
			'slug' => fake()->slug(5),
			'title' => fake()->words(3, true),
			'description' => fake()->sentence(10, true),
			'filesize' => fake()->numberBetween(1, 5000000)
		];
	}
}
