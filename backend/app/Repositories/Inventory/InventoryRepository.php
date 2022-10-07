<?php

namespace App\Repositories\Inventory;

use App\Contracts\Inventoriable;
use App\Contracts\Repositories\InventoryContract;
use App\Contracts\Repository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class InventoryRepository implements InventoryContract, Repository
{
	/**
	 * Model that implements Inventoriable contract
	 *
	 * @var Inventoriable
	 */
	private Inventoriable $model;

	/**
	 * Constructs repository using any model that implements the Inventoriable contract
	 *
	 * @param Inventoriable $model
	 */
	public function __construct(Inventoriable $model)
	{
		$this->model = $model;
	}

	public function getModel()
	{
		return $this->model;
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
	 * @return ?Model
	 */
	public function getById(string|int $id): ?Model
	{
		return $this->model->find($id);
	}

	public function getInventory($id)
	{
		return $this->getById($id)?->inventory;
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

	/**
	 * Retrieves total inventory quantity of given model
	 *
	 * @param $item_id
	 * @param $location_id
	 * @return int
	 */
	public function getItemQuantityAtLocation($item_id, $location_id): int
	{
		return $this->model
			->where('id', $item_id)
			->sum('quantity');
	}

}