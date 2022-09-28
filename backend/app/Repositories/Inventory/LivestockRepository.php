<?php

namespace App\Repositories\Inventory;

use App\Enums\EquipmentCondition;
use App\Models\Livestock;
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
	
	public function getLivestockByType(EquipmentCondition $condition): Collection
	{
		return $this->model->where('type', $condition)->get();
	}

	public function countLivestockByType(EquipmentCondition $condition): int
	{
		return $this->model->where('type', $condition)->count();
	}

	public function countAllLivestockTypes(): Collection
	{
		return $this->model
			->select('type', DB::raw('count(id) as count'))
			->groupBy('type')
			->get()
			->map(function ($e) {
				$e->type_description = $e->type->formatted();
				return $e;
			});
	}


}