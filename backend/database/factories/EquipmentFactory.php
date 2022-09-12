<?php

namespace Database\Factories;

use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
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
			'type' => fake()->randomElement(EquipmentType::cases()),
			'condition' => fake()->randomElement(EquipmentCondition::cases()),
			'description' => fake()->paragraph(3)
        ];
    }
}
