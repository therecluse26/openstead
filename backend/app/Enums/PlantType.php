<?php

namespace App\Enums;

enum PlantType: string
{
	case Flower = 'flower';
	case Bush = 'bush';
	case Tree = 'tree';
	case Nightshade = 'nightshade';
	case Legume = 'legume';
	case Cucurbit = 'cucurbit';
	case Brassica = 'brassica';
	case Allium = 'allium';
	case Aster = 'aster';
	case Grass = 'grass';
	case Umbel = 'umbel';
	case Labiatae = 'labiatae';
	case Malvaceae = 'malvaceae';
	case Amaranthaceae = 'amaranthaceae';
	case Polygonaceae = 'polygonaceae';
	case Convolvulaceae = 'convolvulaceae';
	case Other = 'other';

	public function label(): string
	{
		return match ($this) {
			self::Flower => 'Flower',
			self::Bush => 'Bush/Shrub',
			self::Tree => 'Tree',
			self::Nightshade => 'Nightshade',
			self::Legume => 'Bean/Legume',
			self::Cucurbit => 'Cucurbit',
			self::Brassica => 'Brassica',
			self::Allium => 'Allium',
			self::Aster => 'Aster',
			self::Grass => 'Grass',
			self::Umbel => 'Umbel',
			self::Labiatae => 'Labiatae',
			self::Malvaceae => 'Malvaceae',
			self::Amaranthaceae => 'Amaranthaceae',
			self::Polygonaceae => 'Polygonaceae',
			self::Convolvulaceae => 'Convolvulaceae',
			self::Other => 'Other'
		};
	}

	public function icon(): string
	{
		return match ($this) {
			self::Flower => '🌷',
			self::Bush => '🪴',
			self::Tree => '🌲',
			self::Nightshade => '🍅',
			self::Legume => '🥜',
			self::Cucurbit => '🥒',
			self::Brassica => '🥦',
			self::Allium => '🧄',
			self::Aster => '🥬',
			self::Grass => 'Grass',
			self::Umbel => '🥕',
			self::Labiatae => '🌿',
			self::Malvaceae => 'Malvaceae',
			self::Amaranthaceae => 'Amaranthaceae',
			self::Polygonaceae => 'Polygonaceae',
			self::Convolvulaceae => 'Convolvulaceae',
			self::Other => 'Other'
		};
	}

	public function description(): string
	{
		return match ($this) {
			self::Flower, self::Tree, self::Bush => $this->label(),
			self::Nightshade => 'Nightshades include varieties of tomatoes, peppers, eggplants, potatoes, ground cherries and tobacco',
			self::Legume => 'Legumes include varieties of beans, peas, southern peas, peanuts, clover and vetch',
			self::Cucurbit => 'Cucurbits plants include varieties of squash (including pumpkins and zucchini), melons, gourds and cucumbers',
			self::Brassica => 'Brassica plants include varieties of cabbage, broccoli, cauliflower, kale, collards, mustard, kohlrabi, turnips, radishes, canola, arugula and cress',
			self::Allium => 'Alliums include varieties of onions, garlic, shallots, leeks and chives',
			self::Aster => 'Asters include varieties of lettuce, salsify, artichokes, radicchio, endive, sunflowers, Echinacea, cosmos, marigolds, chamomile',
			self::Grass => 'Grasses include varieties of corn, rye, oats, wheat, sorghum, rice and millet',
			self::Umbel => 'Umbels include varieties of carrots, parsnips, celery, parsley, dill, fennel and cilantro',
			self::Labiatae => 'Labiatae include mint, basil, rosemary, sage, catnip, lemon balm, bergamot and other herbs',
			self::Malvaceae => 'Malvaceae include varieties of okra, roselle and cotton',
			self::Amaranthaceae => 'Amaranthaceae include varieties of chard, beets, spinach and amaranth',
			self::Polygonaceae => 'Polygonaceae include varieties of buckwheat, rhubarb and sorrel',
			self::Convolvulaceae => 'Convolvulaceae include varieties of sweet potatoes and morning glories',
			self::Other => 'Other or unknown variety'
		};
	}

	public function formatted(): array
	{
		return ['key' => $this, 'label' => $this->label(), 'description' => $this->description()];
	}

	public static function getTypes(): array
	{
		return self::cases();
	}
}
