<?php

namespace Database\Factories;

use App\Enums\ServiceType;
use App\Models\Service;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
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
			'type' => fake()->randomElement(ServiceType::cases()),
			'title' => fake()->words(3, true),
			'description' => fake()->sentence(random_int(5, 15), true),
		];
	}
}
