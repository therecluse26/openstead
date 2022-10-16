<?php

namespace App\Enums;

use App\Traits\FilterableEnum;
use Exception;

enum PlantType: string
{
	use FilterableEnum;

	// Generic
	case Bush = 'bush';
	case Tree = 'tree';
	case Flower = 'flower';

	// Vegetables
	case VegBulb = 'veg.bulb';
	case VegFlower = 'veg.flower';
	case VegFruit = 'veg.fruit';
	case VegFungus = 'veg.fungus';
	case VegLeaf = 'veg.leaf';
	case VegRoot = 'veg.root';
	case VegSeed = 'veg.seed';
	case VegStem = 'veg.stem';
	case VegTuber = 'veg.tuber';
	case VegGrass = 'veg.grass';

	// Fruits
	case FruitStone = 'fruit.stone';
	case FruitPome = 'fruit.pome';
	case FruitBerry = 'fruit.berry';
	case FruitCitrus = 'fruit.citrus';
	case FruitMelon = 'fruit.melon';
	case FruitTropical = 'fruit.tropical';

	// Other
	case Nut = 'nut';
	case Other = 'other';

	public function label(): string
	{
		return match ($this) {
			self::Flower => 'Flower',
			self::Bush => 'Bush/Shrub',
			self::Tree => 'Tree',
			self::VegBulb => 'Bulb Vegetable',
			self::VegFlower => 'Flower Vegetable',
			self::VegFruit => 'Fruit Vegetable',
			self::VegFungus => 'Fungus',
			self::VegLeaf => 'Leafy Vegetable',
			self::VegRoot => 'Root Vegetable',
			self::VegSeed => 'Seed Vegetable',
			self::VegStem => 'Stem Vegetable',
			self::VegTuber => 'Tuber',
			self::VegGrass => 'Grass',
			self::FruitStone => 'Stone/Pit Fruit',
			self::FruitPome => 'Pome/Core Fruit',
			self::FruitBerry => 'Berry',
			self::FruitCitrus => 'Citrus',
			self::FruitMelon => 'Melon',
			self::FruitTropical => 'Tropical/Exotic Fruit',
			self::Nut => 'Nut',
			self::Other => 'Other'
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::Flower => '🌷',
			self::Bush => '🪴',
			self::Tree => '🌲',
			self::VegBulb => '🧄',
			self::VegFlower => '🥦',
			self::VegFruit => '🍅',
			self::VegFungus => '🍄',
			self::VegLeaf => '🥬',
			self::VegRoot => '🥕',
			self::VegSeed => '🌽',
			self::VegStem => '🌾',
			self::VegTuber => '🥔',
			self::VegGrass => '🌱',
			self::FruitStone => '🍑',
			self::FruitPome => '🍎',
			self::FruitBerry => '🍓',
			self::FruitCitrus => '🍊',
			self::FruitMelon => '🍉',
			self::FruitTropical => '🍌',
			self::Nut => '🥜',
			self::Other => '🦠'
		};
	}

	public function description(): string
	{
		return match ($this) {
			self::Flower, self::Tree, self::Bush => $this->label(),

			self::VegBulb => "Bulb vegetables usually develop close below the ground's surface and send up a fleshy, leafy stem above it. Typically, bulbs are made up of layers or segments.",
			self::VegFlower => "Flower vegetables are classified as such because the main edible part of the vegetable is the flowering portion.",
			self::VegFruit => 'Fruit vegetables have seeds and fleshy pulp.',
			self::VegFungus => 'Fungi vegetables are typically called mushrooms.',
			self::VegLeaf => 'Leaf vegetables refer to plants whose leaves are their primary food product.',
			self::VegRoot => 'Root vegetables typically have a long or round taproot.',
			self::VegSeed => 'Seed vegetables have edible seeds that grow either in pods (beans) or on the outside of the vegetable (corn/maize)',
			self::VegStem => 'Stem vegetables have edible stalks as the main part of the vegetable.',
			self::VegTuber => "Tubers are vegetables which grow underground attached to the plant's root.",
			self::VegGrass => "Grasses are edible plants whose product is either the grassy greens that sprout from the ground, or whose grains are used as food.",

			self::FruitStone => 'Stone/Pit Fruit',
			self::FruitPome => 'Pome/Core Fruit',
			self::FruitBerry => 'Berry',
			self::FruitCitrus => 'Citrus',
			self::FruitMelon => 'Melon',
			self::FruitTropical => 'Tropical/Exotic Fruit',
			self::Nut => 'Nut',

			self::Other => 'Other or unknown variety'
		};
	}

	public function examples(): string
	{
		return match ($this) {
			self::VegFlower => 'Artichoke, cauliflower, broccoli',
			self::VegBulb => 'Onion, garlic, leek, fennel, shallot, spring onion',
			self::VegFruit => "Cucumber, eggplant, peppers, plantain, pumpkin, squash, tomato",
			self::VegFungus => "Button white, swiss brown, enoki, oyster, portabello, shiitake, truffle",
			self::VegLeaf => "Bok choy, brussels sprouts, cabbage, kale, lettuce, sorrel, spinach, watercress",
			self::VegRoot => "Beetroot, carrot, celeriac, parsnip, radish, turnip",
			self::VegSeed => "Beans, peas, corn",
			self::VegStem => "Asparagus, celery, kohlrabi, rhubarb",
			self::VegTuber => "Earth gem, potato, yam",
			self::VegGrass => "Alfalfa, barley, millet, oats, rice, sorghum, wheat",


			self::Bush => throw new Exception('To be implemented'),
			self::Tree => throw new Exception('To be implemented'),
			self::Flower => throw new Exception('To be implemented'),
			self::FruitStone => throw new Exception('To be implemented'),
			self::FruitPome => throw new Exception('To be implemented'),
			self::FruitBerry => throw new Exception('To be implemented'),
			self::FruitCitrus => throw new Exception('To be implemented'),
			self::FruitMelon => throw new Exception('To be implemented'),
			self::FruitTropical => throw new Exception('To be implemented'),
			self::Nut => throw new Exception('To be implemented'),
			self::Other => throw new Exception('To be implemented'),
		};
	}

	public function toFilter(): array
	{
		return ['key' => $this, 'label' => $this->label(), 'description' => $this->description()];
	}

	public static function getTypes(): array
	{
		return self::cases();
	}
}
