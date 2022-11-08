<?php

namespace App\Repositories\Inventory;

use App\Enums\LivestockType;
use App\Http\Requests\Inventory\StoreLivestockBreedRequest;
use App\Http\Requests\Inventory\StoreLivestockRequest;
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

	public function create(StoreLivestockRequest $request): Livestock
	{
		return $this->model->create($request->only([
			'name',
			'description',
			'variety_id',
			'sex',
			'date_of_birth',
			'parent_id',
			'quantity',
			'acquired_at'
		]));
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
		})->get();
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