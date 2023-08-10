<?php

namespace App\Repositories\Inventory;

use App\Contracts\Inventoriable;
use App\Contracts\Repository;
use App\Models\Location;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class LocationRepository implements Repository
{
	/**
	 * Location model
	 *
	 * @var Location
	 */
	private Location $model;

	/**
	 * Constructs repository using Location model
	 */
	public function __construct()
	{
		$this->model = new Location();
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

	public function getById(string $id): Location
	{
		return $this->model->findOrFail($id);
	}

	public function getLocation($location_id): Location
	{
		return $this->getById($location_id);
	}

	public function getInventory($location_id): Collection
	{
		return $this->getLocation($location_id)?->inventory;
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
	 * @param string $id
	 * @return Model
	 */
	public function find(string $id): Model
	{
		return $this->getById($id);
	}

	public function getModel(): Model|Inventoriable
	{
		return $this->model;
	}
}