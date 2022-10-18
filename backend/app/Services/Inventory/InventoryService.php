<?php

namespace App\Services\Inventory;

use App\Contracts\Inventoriable;
use App\Enums\InventoryType;
use App\Models\Inventory\Inventory;
use App\Repositories\Inventory\InventoryRepository;
use App\Services\DataTableService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use InvalidArgumentException;
use JsonException;
use ReflectionException;

class InventoryService
{
	public static function getTypes()
	{
		return InventoryType::cases();
	}

	public static function getFilters(): Collection
	{
		$filters = collect();
		foreach (InventoryType::cases() as $type) {
			$typeFilters = $type->value::getFilters();
			if (!$typeFilters->isEmpty()) {
				$filters->push([$type->name => $type->value::getFilters()]);
			}
		}
		return $filters;
	}

	/**
	 * Builds data for inventory Datatable
	 *
	 * @throws JsonException
	 * @throws ReflectionException
	 */
	public static function buildInventoryTableData(string $model, Request $request): LengthAwarePaginator
	{
		if (!isset(class_implements($model)[Inventoriable::class])) {
			throw new InvalidArgumentException('Given model must implement Inventoriable');
		}

		return DataTableService::buildAndExecuteQuery(
			new InventoryRepository(new $model()),
			json_decode($request->get('lazyEvent'), false, 512, JSON_THROW_ON_ERROR)
		);
	}


}