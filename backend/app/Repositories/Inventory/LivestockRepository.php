<?php

namespace App\Repositories\Inventory;

use App\Enums\AnimalType;
use App\Http\Requests\Inventory\StoreLivestockBreedRequest;
use App\Models\Inventory\Livestock;
use App\Models\Scopes\AliveScope;
use App\Models\Variety;
use App\Traits\AddMedia;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class LivestockRepository extends InventoryRepository
{
	use AddMedia;

	private Livestock $model;

	public function __construct()
	{
		$this->model = new Livestock();
		parent::__construct($this->model);
	}
	
	public function find(string $id): Livestock
	{
		return $this->model->findOrFail($id);
	}

	public function findUnscoped(string $id): Livestock
	{
		return $this->model->withoutGlobalScope(AliveScope::class)->findOrFail($id);
	}

	public function create(array $data, ?array $images, ?array $parents, ?array $children): Livestock
	{
		$model = $this->model->create($data);

		if ($parents) {
			$model->parents()->attach($parents);
		}
		if ($children) {
			$model->children()->attach($children);
		}
		if ($images) {
			$this->addOrReplaceImagesBase64($model, $images);
		}

		return $model;
	}

	public function update(Livestock $model, array $data, ?array $images, ?array $parents, ?array $children): Livestock
	{
		$model->update($data);

		// Deletes parents
		$model->parents()->detach();
		// Reattaches parents if found
		if ($parents) {
			$model->parents()->attach($parents);
		}

		// Deletes children
		$model->children()->detach();
		// Reattaches children if found
		if ($children) {
			$model->children()->attach($children);
		}

		if ($images) {
			$this->addOrReplaceImagesBase64($model, $images);
		}

		return $model;
	}

	public function markDeceased(Livestock $model, bool $deceased = true): bool
	{
		return $model->update(['date_of_death' => $deceased ? Carbon::now() : null]);
	}

	public static function getTypes(): array
	{
		return AnimalType::cases();
	}

	public function getTypeMembers(AnimalType $type)
	{
		return Livestock::whereHas('variety', function ($query) use ($type) {
			$query->where('group', 'animal');
			$query->where('group_type', $type);
		})->orderBy('name')->get();
	}

	public function createVarietyValue(StoreLivestockBreedRequest $request): Variety
	{
		return Variety::create($request->only([
			'group',
			'group_type',
			'variety_name',
			'description'
		]));
	}

	public function getFilters(): Collection
	{
		return collect([
			'types' => collect(AnimalType::cases())
				->map(function ($type) {
					return $type->toFilter();
				})
		]);
	}

	public static function getTypeVarieties(string $type): Collection
	{
		return collect(Variety::where('group', 'animal')->where('group_type', $type)->get());
	}

	public function getSimilar(string $livestock_id): Collection
	{
		$livestock = $this->findUnscoped($livestock_id);

		if(!$livestock) return collect([]);

		return Livestock::whereNot('id', $livestock_id)
			->where('variety_id', $livestock->variety_id)
			->inRandomOrder()
			->take(6)
			->get();
	}

}