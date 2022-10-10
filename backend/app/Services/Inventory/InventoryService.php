<?php

namespace App\Services\Inventory;

use App\Contracts\Inventoriable;
use App\Enums\InventoryType;
use App\Models\Inventory\Inventory;
use App\Repositories\Inventory\InventoryRepository;
use App\Services\DataTableService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use InvalidArgumentException;
use JsonException;

class InventoryService
{
	public static function getTypes()
	{
		return InventoryType::getTypes();
	}

	/**
	 * Builds data for inventory Datatable
	 *
	 * @throws JsonException
	 */
	public static function buildInventoryTableData(string $model, Request $request): LengthAwarePaginator
	{
		$implements = class_implements($model);
		if (!isset($implements[Inventoriable::class])) {
			throw new InvalidArgumentException('Given model must implement Inventoriable');
		}

		$modelRepo = new InventoryRepository(new $model());

		return self::buildAndExecuteQuery($modelRepo, $request);
	}

	public static function buildAndExecuteQuery(Builder|Model|InventoryRepository $model, Request $request): LengthAwarePaginator
	{
		$params = json_decode($request->get('lazyEvent'), false, 512, JSON_THROW_ON_ERROR);
		$rows = $params->rows ?? 15;
		$page = $params->page ?? 0;
		$sortField = DataTableService::getSortField($params->sortField);
		$sortOrder = $params->sortOrder ?? 1;
		$filters = (array)$params->filters;

		foreach ($filters as $filterName => $filterValue) {
			unset($filters[$filterName]);
			$matchedName = DataTableService::getFieldInModelOrRelation($model, $filterName);
			if ($matchedName) {
				$filters[$matchedName] = $filterValue;
			}
		}

		$query = DataTableService::buildOrderBy($model, $sortField, $sortOrder);

		$query = DataTableService::buildFilters($query, (object)$filters);

		return $query->paginate($rows, ['*'], 'page', $page + 1);
	}


}