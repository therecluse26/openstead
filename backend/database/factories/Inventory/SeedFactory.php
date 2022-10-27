<?php

namespace Database\Factories\Inventory;

use App\Enums\PlantType;
use App\Models\Inventory\Equipment;
use App\Models\Inventory\Seed;
use App\Models\Variety;
use App\Providers\FakerImageProvider;
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
			'variety_id' => Variety::where('kingdom', 'plant')->whereIn('group_type', PlantType::cases())->inRandomOrder()->first(),
			'quantity' => fake()->numberBetween(0, 10),
			'acquired_at' => fake()->dateTimeThisYear(),
		];
	}

	public function configure()
	{
		return $this->afterCreating(function (Seed $model) {
			$faker = \Faker\Factory::create();
			$faker->addProvider(new FakerImageProvider($faker));
			$image = $faker->image('/tmp', 1280, 720);
			$model->addMedia($image)
				->toMediaCollection('images');
		});
	}
}
