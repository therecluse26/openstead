<?php

namespace Database\Factories\Inventory;

use App\Enums\Sex;
use App\Models\Inventory\Equipment;
use App\Models\Inventory\Livestock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class LivestockParentFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		$this_livestock = Livestock::inRandomOrder()->first();
		$parent = Livestock::where('id', '!=', $this_livestock->id)->inRandomOrder()->first();
		$sex = Sex::from($parent->sex) ?? fake()->randomElement(Sex::cases());
		return [
			'livestock_id' => $this_livestock,
			'parent_id' => $parent,
			'relationship' => $sex->getParentValue()
		];
	}
	
}
