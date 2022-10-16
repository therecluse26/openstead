<?php

namespace App\Repositories\Inventory;

use App\Http\Requests\Inventory\StoreLivestockRequest;
use App\Models\Inventory\Livestock;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class LivestockRepository extends InventoryRepository
{
	private Livestock $model;

	public function __construct()
	{
		$this->model = new Livestock();
		parent::__construct($this->model);
	}

	public function countAllLivestockTypes(): Collection
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

	public function create(StoreLivestockRequest $request): Livestock
	{
		$equipment = $this->model->create($request->only([
			'name',
			'type',
			'breed',
			'date_of_birth'
		]));

		$this->createInventoryRelation($equipment, $request);

		return $equipment;
	}


}