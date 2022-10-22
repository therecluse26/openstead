<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceLog>
 */
class ServiceLogFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		return [
			'notes' => fake()->paragraphs(4, true),
			'service_id' => Service::inRandomOrder()->first()
		];
	}
}
