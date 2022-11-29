<?php

namespace App\Repositories\Inventory;

use App\Enums\PlantLifeCycle;
use App\Enums\PlantLightRequirement;
use App\Enums\PlantType;
use App\Http\Requests\Inventory\StoreSeedRequest;
use App\Http\Requests\Inventory\StoreSeedVarietyRequest;
use App\Models\Inventory\Seed;
use App\Models\Variety;
use App\Traits\AddMedia;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SeedRepository extends InventoryRepository
{
	use AddMedia;

	private Seed $model;

	public function __construct()
	{
		$this->model = new Seed();
		parent::__construct($this->model);
	}


	public function countAllSeedTypes(): Collection
	{
		return $this->model
			->select('type', DB::raw('count(id) as count'))
			->groupBy('type')
			->get()
			->map(function ($e) {
				$e->type_formatted = $e->type->toFilter();
				return $e;
			});
	}

	public function find(int $id): Seed
	{
		return $this->model->findOrFail($id);
	}


	public function create(StoreSeedRequest $request): Seed
	{
		$model = $this->model->create($request->only([
			'name',
			'type',
			'variety',
			'quantity',
			'acquired_at'
		]));

		return $model;
	}

	public static function getTypes(): array
	{
		return PlantType::cases();
	}

	public static function getTypeVarieties(string $type): Collection
	{
		return collect(Variety::where('kingdom', 'plant')->where('group_type', $type)->get());
	}


	public static function getFormattedTypes(): Collection
	{
		return collect(PlantType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getFilters(): Collection
	{
		return collect([
			'types' => collect(PlantType::cases())->map(function ($type) {
				return $type->toFilter();
			}),
			'life_cycles' => collect(PlantLifeCycle::cases())->map(function ($type) {
				return $type->toFilter();
			}),
			'light_requirements' => collect(PlantLightRequirement::cases())->map(function ($type) {
				return $type->toFilter();
			})
		]);
	}

	public function createVarietyValue(StoreSeedVarietyRequest|FormRequest $request): Variety
	{
		return Variety::create($request->only([
			'kingdom',
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