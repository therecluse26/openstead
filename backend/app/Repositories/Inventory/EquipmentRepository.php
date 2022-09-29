<?php

namespace App\Repositories\Inventory;

use App\Enums\EquipmentCondition;
use App\Models\Equipment;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EquipmentRepository extends InventoryRepository
{
	private Equipment $model;

	public function __construct()
	{
		$this->model = new Equipment();
		parent::__construct($this->model);
	}

	public function getEquipmentByCondition(EquipmentCondition $condition): Collection
	{
		return $this->model->where('condition', $condition)->get();
	}

	public function countEquipmentByCondition(EquipmentCondition $condition): int
	{
		return $this->model->where('condition', $condition)->count();
	}

	public function countAllEquipmentConditions(): Collection
	{
		return $this->model
			->select('condition', DB::raw('count(id) as count'))
			->groupBy('condition')
			->orderBy('condition')
			->get();
	}

	public function countAllEquipmentTypes(): Collection
	{
		return $this->model
			->select('type', DB::raw('count(id) as count'))
			->groupBy('type')
			->orderBy('type')
			->get()
			->map
			->only('type', 'count');
	}

}