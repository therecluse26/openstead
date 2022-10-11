<?php

namespace App\Repositories\Inventory;

use App\Http\Requests\Inventory\StoreSeedRequest;
use App\Models\Inventory\Seed;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SeedRepository extends InventoryRepository
{
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
				$e->type_formatted = $e->type->formatted();
				return $e;
			});
	}

	public function create(StoreSeedRequest $request): Seed
	{
		$model = $this->model->create($request->only([
			'name',
			'type',
			'variety',
			'acquired_at'
		]));

		$this->createInventoryRelation($model, $request);

		return $model;
	}


}