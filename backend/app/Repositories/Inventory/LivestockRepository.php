<?php

namespace App\Repositories\Inventory;

use App\Enums\LivestockType;
use App\Http\Requests\Inventory\StoreLivestockBreedRequest;
use App\Models\Inventory\Livestock;
use App\Models\Scopes\AliveScope;
use App\Models\Variety;
use App\Traits\AddMedia;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class LivestockRepository extends InventoryRepository
{
	use AddMedia;

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

	public function find(int $id): Livestock
	{
		return $this->model->findOrFail($id);
	}

	public function findUnscoped(int $id): Livestock
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

	public function delete(Livestock $model): ?bool
	{
		return $model->delete();
	}

	public function markDeceased(Livestock $model, bool $deceased = true): bool
	{
		return $model->update(['date_of_death' => $deceased ? Carbon::now() : null]);
	}

	public static function getTypes(): array
	{
		return LivestockType::cases();
	}

	public function getTypeMembers(LivestockType $type)
	{
		return Livestock::whereHas('variety', function ($query) use ($type) {
			$query->where('kingdom', 'animal');
			$query->where('group_type', $type);
		})->orderBy('name')->get();
	}

	public function createBreedValue(StoreLivestockBreedRequest $request): Variety
	{
		return Variety::create($request->only([
			'kingdom',
			'group_type',
			'variety_name',
			'description'
		]));
	}

	public static function getFormattedTypes(): Collection
	{
		return collect(LivestockType::cases())
			->map(function ($type) {
				return $type->toFilter();
			});
	}

	public static function getTypeVarieties(string $type): Collection
	{
		return collect(Variety::where('kingdom', 'animal')->where('group_type', $type)->get());
	}

	public function getSimilar(int $livestock_id): Collection
	{
		$livestock = $this->findUnscoped($livestock_id);
		return Livestock::whereNot('id', $livestock_id)
			->where('variety_id', $livestock->variety_id)
			->inRandomOrder()
			->take(6)
			->get();
	}

}