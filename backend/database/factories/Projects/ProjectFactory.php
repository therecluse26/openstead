<?php

namespace Database\Factories\Projects;

use App\Models\Inventory\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Equipment>
 */
class ProjectFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
        $name = fake()->words(3, true);
        $id =  strtolower(Str::ulid());
		return [
            'id' => $id,
			'name' => $name,
			'description' => fake()->paragraph(2),
			'active' => fake()->boolean(),
        ];
	}
}
