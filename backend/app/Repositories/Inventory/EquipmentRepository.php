<?php

namespace App\Repositories\Inventory;

use App\Enums\EquipmentCondition;
use App\Models\Inventory\Equipment;
use App\Repositories\ImageRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EquipmentRepository extends InventoryRepository
{
	private Equipment $model;
	private ImageRepository $images;

	public function __construct()
	{
		$this->model = new Equipment();
		$this->images = new ImageRepository();
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
			$request->only([
				'name',
				'type',
				'condition',
				'description',
				'quantity'
			])
		);

		// Upload images
		$images = collect($request->input('images'));
		if ($images->count() == 0) {
			return $equipment;
		}

		foreach ($images as $image) {
			$extension = explode('/', mime_content_type($image))[1];
			$imageId = Str::uuid() . $extension;
			if (preg_match('/^data:image\/(\w+);base64,/', $image)) {
				$data = substr($image, strpos($image, ',') + 1);
				$data = base64_decode($data);
				if (Storage::disk('media')->put($imageId, $data)) {
					$equipment
						->addMediaFromDisk($imageId, 'media')
						->toMediaCollection();
				}
			}
		}

		return $equipment;
	}

}