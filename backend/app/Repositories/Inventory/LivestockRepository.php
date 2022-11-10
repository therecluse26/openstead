<?php

namespace App\Repositories\Inventory;

use App\Enums\LivestockType;
use App\Http\Requests\Inventory\StoreLivestockBreedRequest;
use App\Models\Inventory\Livestock;
use App\Models\Variety;
use App\Traits\AddMedia;
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
		return collect(LivestockType::cases())->map(function ($type) {
			return $type->toFilter();
		});
	}

	public static function getTypeVarieties(string $type)
	{
		return collect(Variety::where('kingdom', 'animal')->where('group_type', $type)->get());
	}

	public static function getSimilar(Livestock $livestock): Collection
	{
		return Livestock::whereNot('id', $livestock->id)->where('variety_id', $livestock->variety_id)->inRandomOrder()->take(6)->get();
	}
}