<?php

namespace Database\Factories\Inventory;

use App\Enums\HardinessZone;
use App\Enums\PlantLifeCycle;
use App\Enums\PlantLightRequirement;
use App\Enums\PlantType;
use App\Models\Inventory\Equipment;
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
			'variety_id' => Variety::where('group', 'plant')->whereIn('group_type', PlantType::cases())->inRandomOrder()->first(),
			'quantity' => fake()->numberBetween(0, 10),
			'life_cycle' => fake()->randomElement(PlantLifeCycle::cases()),
			'days_to_germination' => fake()->numberBetween(4, 42),
			'days_to_maturity' => fake()->numberBetween(22, 160),
			'planting_depth' => fake()->randomElement([0.125, 0.25, 0.5, 1, 1.5, 2, 2.5]),
			'plant_spacing' => fake()->randomElement([1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 36, 48, 60]),
			'light_requirement' => fake()->randomElement(PlantLightRequirement::cases()),
			'zone_lower' => fake()->randomElement(HardinessZone::cases()),
			'zone_upper' => fake()->randomElement(HardinessZone::cases()),
			'url' => fake()->url(),
			'acquired_at' => fake()->dateTimeThisYear(),
		];
	}

//	public function configure()
//	{
//		return $this->afterCreating(function (Seed $model) {
//			$faker = \Faker\Factory::create();
//			$faker->addProvider(new FakerImageProvider($faker));
//			$image = $faker->image('/tmp', 1280, 720);
//			$model->addMedia($image)
//				->toMediaCollection('images');
//		});
//	}
}
