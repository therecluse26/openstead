<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Contracts\Inventoriable;
use App\Contracts\Repository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class InventoryRepository implements Repository
{
	/**
	 * Model that implements Inventoriable contract
	 *
	 * @var Inventoriable|Model
	 */
	private Inventoriable|Model $model;

	/**
	 * Constructs repository using any model that implements the Inventoriable contract
	 *
	 * @param Inventoriable|Model $model
	 */
	public function __construct(Inventoriable|Model $model)
	{
		$this->model = $model;
	}

	public function getModel(): Model|Inventoriable
	{
		return $this->model;
	}

	public function countAllTypes(): Collection
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
		
	/**
	 * Proxy methods to underlying model
	 *
	 * @param string $method
	 * @param array $arguments
	 * @return mixed
	 */
	public function __call(string $method, array $arguments): mixed
	{
		return $this->model->$method(...$arguments);
	}


	/**
	 * Retrieves total count of given model
	 *
	 * @return int
	 */
	public function count(): int
	{
		return $this->model->count();
	}

	/**
	 * Retrieves all rows of given model
	 *
	 * @return Collection
	 */
	public function all(): Collection
	{
		return $this->model->all();
	}

	/**
	 * Finds model by ID
	 *
	 * @param string|int $id
	 * @return Model
	 */
	public function getById(string|int $id): Model
	{
		return $this->model->findOrFail($id);
	}

	/**
	 * Deletes model by ID
	 *
	 * @param Model|Inventoriable|int|string $model
	 * @return ?bool
	 */
	public function delete(Model|Inventoriable|int|string $model): ?bool
	{
		if (is_int($model) || is_string($model)) {
			$model = $this->getById($model);
		}
		return $model->delete();
	}

	/**
	 * Deletes multiple models by list of ids
	 *
	 * @param array $ids
	 * @return ?bool
	 */
	public function deleteMultiple(array $ids): ?bool
	{
		return $this->model->whereIn($ids)->delete();
	}

	/**
	 * Retrieves total inventory quantity of given model
	 *
	 * @return int
	 */
	public function getTotalInventoryTypeQuantity(): int
	{
		return $this->model->sum('quantity');
	}

	/**
	 * Retrieves total inventory quantity of given model
	 *
	 * @param $item_id
	 * @return int
	 */
	public function getTotalItemQuantity($item_id): int
	{
		return $this->model
			->where('id', $item_id)
			->sum('quantity');
	}

}