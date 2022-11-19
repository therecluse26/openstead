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

	public function find(int $livestock_id): Livestock
	{
		return $this->model->findOrFail($livestock_id);
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

//	public function getFamilyTree(Livestock $livestock)
//	{
//		return collect([
//			'ancestors' => $this->getAncestry($livestock),
//			'posterity' => $this->getPosterity($livestock),
//			'siblings' => $this->getSiblings($livestock)
//		]);
//	}

	public function getFamilyTree(Livestock $livestock, int $generations = 5): Collection
	{
		$familyTree = collect();

		// Traverse lineage up until max ($generations) # is reached
		$topAncestor = $livestock;
		for ($g = 0; $g <= $generations; $g++) {
			if ($topAncestor->parents()->count() === 0) {
				break;
			}
			$topAncestor = $topAncestor->parents->first();
		}

		// Find all siblings of ancestor if possible
		$generation = collect();
		if ($topAncestor->parents()->count() > 0) {
			foreach ($topAncestor->parents as $parent) {
				$generation->push($parent->children);
			}
		} else {
			foreach ($topAncestor->children as $child) {
				$generation->push($child->parents);
			}
		}
		$generation = $generation->flatten()->unique();

		// Foreach final ancestor generation member, find all children (eliminating duplicates)
		// Do this recursively until ($generations) number of generations x2 is reached
		// (this will satisfy the generation count for children)
		foreach ($generation as $member) {
			// Get all posterity of family tree member
			$familyTree->push($this->getPosterity($member));
		}
		return $familyTree;
	}

	public function getAncestry(Livestock $livestock)
	{
		$ancestors = collect();
		foreach ($livestock->parents as $parent) {
			$ancestors->push($parent);
			$this->getAncestry($parent);
		}
		return $ancestors;
	}

	public function getPosterity(Livestock $livestock)
	{
		$posterity = collect();
		foreach ($livestock->children as $child) {
			$posterity->push($child);
			$this->getPosterity($child);
		}
		return $posterity;
	}


}