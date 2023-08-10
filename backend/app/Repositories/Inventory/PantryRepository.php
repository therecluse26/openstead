<?php

namespace App\Repositories\Inventory;

use App\Enums\EdibleCompositeEnum;
use App\Http\Requests\Inventory\StorePantryItemVarietyRequest;
use App\Models\Inventory\PantryItem;
use App\Models\Variety;
use App\Traits\AddMedia;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Collection;

class PantryRepository extends InventoryRepository
{
	use AddMedia;

	private PantryItem $model;

	public function __construct()
	{
		$this->model = new PantryItem();
		parent::__construct($this->model);
	}


	public function find(string $id): PantryItem
	{
		return $this->model->findOrFail($id);
	}


	public function create(array $data, ?array $images = null): PantryItem
	{
		$model = $this->model->create($data);

		if ($images) {
			$this->addOrReplaceImagesBase64($model, $images);
		}

		return $model;
	}

	public function update(PantryItem $model, array $data, ?array $images = null): PantryItem
	{
		$model->update($data);

		if ($images) {
			$this->addOrReplaceImagesBase64($model, $images);
		}

		return $model;
	}

	public static function getTypes(): array
	{
		return EdibleCompositeEnum::cases();
	}

	public static function getTypeVarieties(string $type): Collection
	{
		return collect(Variety::where('group_type', $type)->get());
	}

	public static function getFormattedTypes(): Collection
	{
		return collect(EdibleCompositeEnum::cases())->map(function ($type) {
			return $type->toFilter();
		})->sort(function ($item) {
			return $item['label'];
		});
	}

	public function getFilters(): Collection
	{
		return collect([
			'types' => self::getFormattedTypes(),
		]);
	}

	public function createVarietyValue(StorePantryItemVarietyRequest|FormRequest $request): Variety
	{
		return Variety::create($request->only([
			'group',
			'group_type',
			'variety_name',
			'description'
		]));
	}

	public function getSimilar(string $id): Collection
	{
		$result = $this->find($id);
		
		if(!$result) return collect([]);

		return $this->model->whereNot('id', $id)
			->where('variety_id', $result->variety_id)
			->inRandomOrder()
			->take(6)
			->get();
	}
}