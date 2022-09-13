<?php

namespace Database\Factories;

use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Enums\LivestockType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class LivestockGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
			'name' => fake()->text(20),
			'type' => fake()->randomElement(LivestockType::cases()),
			'description' => fake()->paragraph(3)
        ];
    }
}
