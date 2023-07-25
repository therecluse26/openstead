<?php

namespace Database\Factories\Projects;

use App\Models\Inventory\Equipment;
use App\Models\Projects\ProjectItemStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
/**
 * @extends Factory<Equipment>
 */
class ProjectItemFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
        $status = ProjectItemStatus::inRandomOrder()->first();
		return [
            'id' => fake()->uuid(),
			'title' => fake()->words(fake()->numberBetween(2, 15), true),
			'description' => fake()->paragraph(2),
			'project_item_status_id' => (string)$status->id,
            'creator_id' => User::inRandomOrder()->first()?->id ?? 1,
            'due_date' => fake()->dateTimeBetween('+0 days', '+4 years'),
            'completed_at' => $status->name === 'Done' ? fake()->dateTimeBetween('-4 years', '-0 days') : null,
			'completed_by_id' => $status->name === 'Done' ? User::inRandomOrder()->first()?->id ?? 1 : null,
        ];
	}
}
