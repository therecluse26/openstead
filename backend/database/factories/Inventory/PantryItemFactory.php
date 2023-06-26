<?php

namespace Database\Factories\Inventory;

use App\Enums\EdibleCompositeEnum;
use App\Enums\KitchenUnit;
use App\Enums\PantryStorageType;
use App\Models\Inventory\Equipment;
use App\Models\Inventory\PantryItem;
use App\Models\Variety;
use App\Providers\FakerImageProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class PantryItemFactory extends Factory
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
			'storage_type' => fake()->randomElement(PantryStorageType::cases()),
			'variety_id' => Variety::whereIn('group', EdibleCompositeEnum::getVarietyGroups())->whereIn('group_type', EdibleCompositeEnum::cases())->inRandomOrder()->first(),
			'unit' => fake()->randomElement(KitchenUnit::cases()),
			'unit_amount' => fake()->numberBetween(1, 12),
			'quantity' => fake()->numberBetween(0, 10),
			'shelf_life_months' => fake()->numberBetween(1, 120),
			'expiration_date' => fake()->dateTimeBetween('+0 days', '+4 years')
		];
	}

	public function configure()
	{
		return $this->afterCreating(function (PantryItem $model) {
			if(config('seeding.test-data.images')){
				$faker = \Faker\Factory::create();
					$faker->addProvider(new FakerImageProvider($faker));
				$image = $faker->image('/tmp', 1280, 720);
				$model->addMedia($image)
					->toMediaCollection('images');
			}
		});
	}
}