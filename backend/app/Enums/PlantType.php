<?php

namespace App\Enums;

use App\Traits\FilterableEnum;

enum PlantType: string
{
	use FilterableEnum;

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
	case Tree = 'tree';
	case Flower = 'flower';
	case Nut = 'nut';
	case Other = 'other';

	public function label(): string
	{
		return match ($this) {
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
			self::Flower => 'Flower',
			self::Tree => 'Tree',
			self::Nut => 'Nut',
			self::Other => 'Other'
		};
	}

	public function icon(): string
	{
		return match ($this) {
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
			self::Flower => '🌷',
			self::Tree => '🌲',
			self::Nut => '🥜',
			self::Other => '🦠'
		};
	}

	public function description(): string
	{
		return match ($this) {
			self::VegBulb => "Bulb vegetables usually develop close below the ground's surface and send up a fleshy, leafy stem above it. Typically, bulbs are made up of layers or segments.",
			self::VegFlower => "Flower vegetables are classified as such because the main edible part of the vegetable is the flowering portion.",
			self::VegFruit => 'Fruit vegetables have seeds within a fleshy pulp.',
			self::VegFungus => 'Fungi vegetables are typically called mushrooms.',
			self::VegLeaf => 'Leaf vegetables refer to plants whose leaves are their primary food product.',
			self::VegRoot => 'Root vegetables typically have a long or round taproot.',
			self::VegSeed => 'Seed vegetables have edible seeds that grow either in pods (beans) or on the outside of the vegetable (sweet corn).',
			self::VegStem => 'Stem vegetables have edible stalks as the main part of the vegetable.',
			self::VegTuber => "Tubers are vegetables which grow underground attached to the plant's root.",
			self::VegGrass => "Grasses are edible plants whose product is either the grassy greens that sprout from the ground, or whose grains are used as food.",
			self::FruitStone => 'Stone fruits have soft fruit surrounding a single, hard stone, or pit, which contains the seed.',
			self::FruitPome => 'Pome/Core fruit contains a seeded core surrounded by a thick skin.',
			self::FruitBerry => 'Berries are small, juicy fruits with thin skins.',
			self::FruitCitrus => 'Citrus fruits have a thick outer rind with a thin membrane that separates the flesh into segments.',
			self::FruitMelon => 'Melons are large, juicy fruits with thick rinds and many seeds mixed throughout.',
			self::FruitTropical => 'Tropical fruit is any fruit produced by a tree native to the tropics. Usually includes a large portion that is not eaten, but discarded.',

			self::Flower, self::Tree => $this->label(),
			self::Nut => 'Nuts are fruits consisting of a hard or tough shell around an edible kernel.',
			self::Other => 'Other or unknown variety'
		};
	}

	public function examples(): ?string
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

			self::FruitStone => "Cherry, apricot, nectarine, peach, plum",
			self::FruitPome => "Apple, pear, quince",
			self::FruitBerry => "Blackberry, cranberry, blueberry, raspberry, strawberry, grape",
			self::FruitCitrus => "Orange, tangerine, grapefruit, kumquat, lemon, lime",
			self::FruitMelon => "Cantaloupe, casaba, honeydew, watermelon",
			self::FruitTropical => "Banana, mango, papaya, pineapple",

			self::Tree => "Maple, pine, oak, walnut, fir, birch",
			self::Flower => "Lily, daisy, tulip, rose, orchid, hibiscus",
			self::Nut => "Peanut, almond, macadamia, brazil, cashew, chestnut, pistachio, hazelnut, walnut, pecan",
			self::Other => "Ginkgo biloba",
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
