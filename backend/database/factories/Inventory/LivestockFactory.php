<?php

namespace Database\Factories\Inventory;

use App\Enums\LivestockType;
use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use App\Models\Variety;
use App\Providers\FakerImageProvider;
use Faker\Provider\Biased;
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
			'description' => fake()->paragraph(2),
			'variety_id' => Variety::where('kingdom', 'animal')->whereIn('group_type', LivestockType::cases())->inRandomOrder()->first(),
			'sex' => fake()->randomElement(['male', 'female']),
			'date_of_birth' => fake()->biasedNumberBetween(0, 1, [Biased::class, 'linearHigh']) === 0 ? null : fake()->dateTimeThisDecade(),
			'date_of_death' => fake()->biasedNumberBetween(0, 1, [Biased::class, 'linearLow']) === 0 ? null : fake()->dateTimeThisDecade(),
			'quantity' => fake()->numberBetween(0, 10),
			'acquired_at' => fake()->dateTimeThisYear(),
		];
	}

	public function configure()
	{
		return $this->afterCreating(function (Livestock $model) {
			$faker = \Faker\Factory::create();
			$faker->addProvider(new FakerImageProvider($faker));
			$image = $faker->image('/tmp', 1280, 720);
			$model->addMedia($image)
				->toMediaCollection('images');
		});
	}

}
