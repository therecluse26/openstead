<?php

namespace App\Repositories\Inventory;

use App\Enums\EquipmentCondition;
use App\Enums\EquipmentType;
use App\Models\Inventory\Equipment;
use App\Traits\AddMedia;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EquipmentRepository extends InventoryRepository
{
	use AddMedia;

	private Equipment $model;

	private array $fields = [
		'name',
		'type',
		'condition',
		'rating',
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

	public function find(int $id): Equipment
	{
		return $this->model->findOrFail($id);
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

	public function create(array $data, ?array $images): Equipment
	{
		$equipment = $this->model->create($data);

		if ($images) {
			$this->addOrReplaceImagesBase64($equipment, $images);
		}

		return $equipment;
	}

	public function update(Equipment $equipment, array $data, ?array $images): Equipment
	{
		$equipment->update(
			$data
		);

		if ($images) {
			$this->addOrReplaceImagesBase64($equipment, $images);
		}

		return $equipment;
	}

	public static function getFormattedTypes(): Collection
	{
		return collect(EquipmentType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getFilters(): Collection
	{
		return collect([
			'types' => collect(EquipmentType::cases())->map(function ($type) {
				return $type->toFilter();
			}),
		]);
	}

	public function getSimilar(int $id): Collection
	{
		$equipment = $this->find($id);
		return Equipment::whereNot('id', $equipment->id)
			->where('type', $equipment->type)
			->inRandomOrder()
			->take(6)
			->get();
	}
}