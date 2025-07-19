<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceLog;
use App\Models\Tenant;
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
			'tenant_id' => Tenant::first()->id,
			'notes' => fake()->paragraphs(random_int(1, 4), true),
			'service_id' => Service::inRandomOrder()->first(),
			'service_date' => fake()->dateTimeThisDecade()
		];
	}
}
