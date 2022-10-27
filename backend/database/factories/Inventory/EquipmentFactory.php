<?php

namespace Database\Factories\Inventory;

use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Models\Inventory\Equipment;
use App\Providers\FakerImageProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class EquipmentFactory extends Factory
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
			'type' => fake()->randomElement(EquipmentType::cases()),
			'condition' => fake()->randomElement(EquipmentCondition::cases()),
			'description' => fake()->paragraph(2),
			'url' => fake()->url(),
			'quantity' => fake()->numberBetween(0, 10),
			'acquired_at' => fake()->dateTimeThisYear(),
		];
	}

	public function configure()
	{
		return $this->afterCreating(function (Equipment $model) {
			$faker = \Faker\Factory::create();
			$faker->addProvider(new FakerImageProvider($faker));
			$image = $faker->image('/tmp', 1280, 720);
			$model->addMedia($image)
				->toMediaCollection('images');
		});
	}
}
