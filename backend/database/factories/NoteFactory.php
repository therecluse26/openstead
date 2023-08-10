<?php

namespace Database\Factories;

use App\Models\ServiceLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceLog>
 */
class NoteFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		return [
			'note' => fake()->paragraphs(random_int(1, 4), true),
			'creator_id' => User::inRandomOrder()->first()?->id,
		];
	}
}
