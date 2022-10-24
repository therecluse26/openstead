<?php

namespace App\Repositories\Inventory;

use App\Enums\EquipmentCondition;
use App\Http\Requests\Inventory\StoreEquipmentRequest;
use App\Models\Inventory\Equipment;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

	public function create(StoreEquipmentRequest $request): Equipment
	{
		$equipment = $this->model->create($request->only([
			'name',
			'type',
			'condition',
			'description',
			'quantity'
		]));

		// Upload images
		$uploadedImages = collect();
		$images = collect($request->input('images'));
//		dd($images);
		if ($images->count() > 0) {
			foreach ($images as $image) {
				$uploadedImages->push(
					Storage::disk('images')->put("/inventory/equipment/$equipment->id", $image['objectURL'])
				);
			}
		}

		dd($uploadedImages);


		return $equipment;
	}

}