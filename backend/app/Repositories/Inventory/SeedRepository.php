<?php

namespace App\Repositories\Inventory;

use App\Enums\PlantType;
use App\Http\Requests\Inventory\StoreSeedRequest;
use App\Models\Inventory\Seed;
use App\Traits\AddMedia;
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

	public static function getFormattedTypes(): Collection
	{
		return collect(PlantType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}
}