<?php

namespace App\Enums;

final class EdibleCompositeEnum
{
	public const ENUMS = [PlantType::class, AnimalType::class, PantryItemType::class];

	public static function cases(): array
	{
		return collect(self::ENUMS)->flatMap(function ($enum) {
			return $enum::cases();
		})->toArray();
	}

	public static function getVarietyGroups(): array
	{
		return array_map(function ($enum) {
			return $enum::VARIETY_GROUP;
		}, self::ENUMS);
	}

	public static function from(string $value): PlantType|AnimalType|PantryItemType|null
	{
		foreach (self::cases() as $case) {
			if ($case->value === $value) {
				return get_class($case)::from($value);
			}
		}
		return null;
	}

}