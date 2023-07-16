<?php

namespace App\Repositories\Inventory;

use App\Enums\HardinessZone;
use App\Enums\PlantLifeCycle;
use App\Enums\PlantLightRequirement;
use App\Enums\PlantType;
use App\Http\Requests\Inventory\StoreSeedVarietyRequest;
use App\Models\Inventory\Seed;
use App\Models\Variety;
use App\Traits\AddMedia;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Collection;

class SeedRepository extends InventoryRepository
{
	use AddMedia;

	private Seed $model;

	public function __construct()
	{
		$this->model = new Seed();
		parent::__construct($this->model);
	}

	public function find(int $id): Seed
	{
		return $this->model->findOrFail($id);
	}


	public function create(array $data, ?array $images = null): Seed
	{
		$model = $this->model->create($data);

		if ($images) {
			$this->addOrReplaceImagesBase64($model, $images);
		}

		return $model;
	}

	public function update(Seed $model, array $data, ?array $images = null): Seed
	{
		$model->update($data);

		if ($images) {
			$this->addOrReplaceImagesBase64($model, $images);
		}

		return $model;
	}

	public static function getTypes(): array
	{
		return PlantType::cases();
	}

	public static function getTypeVarieties(string $type): Collection
	{
		return collect(Variety::where('group', 'plant')->where('group_type', $type)->get());
	}


	public static function getFormattedTypes(): Collection
	{
		return collect(PlantType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getLifecycles(): Collection
	{
		return collect(PlantLifeCycle::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getLightRequirements(): Collection
	{
		return collect(PlantLightRequirement::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getHardinessZones(): Collection
	{
		return collect(HardinessZone::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getFilters(): Collection
	{
		return collect([
			'types' => self::getFormattedTypes(),
			'life_cycles' => self::getLifecycles(),
			'light_requirements' => self::getLightRequirements()
		]);
	}

	public function createVarietyValue(StoreSeedVarietyRequest|FormRequest $request): Variety
	{
		return Variety::create($request->only([
			'group',
			'group_type',
			'variety_name',
			'description'
		]));
	}

	public function getSimilar(int $id): Collection
	{
		$result = $this->find($id);
		return $this->model->whereNot('id', $id)
			->where('variety_id', $result->variety_id)
			->inRandomOrder()
			->take(6)
			->get();
	}
}