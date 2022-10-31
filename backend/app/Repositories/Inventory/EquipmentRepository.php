<?php

namespace App\Repositories\Inventory;

use App\Enums\EquipmentCondition;
use App\Models\Inventory\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EquipmentRepository extends InventoryRepository
{
	private Equipment $model;

	private array $fields = [
		'name',
		'type',
		'condition',
		'description',
		'location_id',
		'quantity',
		'url',
		'acquired_at'
	];

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

	public function create(Request $request): Equipment
	{
		$equipment = $this->model->create(
			$request->only($this->fields)
		);

		$this->addOrReplaceImagesBase64($equipment, $request->input('images'));

		return $equipment;
	}

	public function update(Equipment $equipment, Request $request): Equipment
	{
		$equipment->update(
			$request->only($this->fields)
		);

		$this->addOrReplaceImagesBase64($equipment, $request->input('images'));

		return $equipment;
	}

	public function addOrReplaceImagesBase64(Equipment $equipment, iterable $images = null): void
	{
		if (is_array($images)) {
			$images = collect($images);
		}
		if ($images->count() === 0) {
			return;
		}

		$equipment->clearMediaCollection('images');

		foreach ($images as $image) {
			$equipment
				->addMediaFromBase64($image, ['image/*'])
				->toMediaCollection('images');
		}
	}

}