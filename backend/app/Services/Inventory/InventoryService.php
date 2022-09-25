<?php

namespace App\Services\Inventory;

use App\Contracts\Inventoriable;
use App\Services\DataTableService;
use http\Exception\InvalidArgumentException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use JsonException;

class InventoryService
{
	/**
	 * @throws JsonException
	 */
	public static function buildInventoryTableData(string $model, Request $request): LengthAwarePaginator
	{
		$implements = class_implements($model);
		if (!isset($implements[Inventoriable::class])) {
			throw new InvalidArgumentException('Given model must implement Inventoriable');
		}

		$params = json_decode($request->get('lazyEvent'), false, 512, JSON_THROW_ON_ERROR);
		$rows = $params->rows ?? 15;
		$page = $params->page ?? 0;
		$sortField = $params->sortField ?? 'id';
		$sortOrder = $params->sortOrder ?? 1;
		$filters = $params->filters;

		$query = $sortOrder === 1 ? $model::orderBy($sortField) : $model::orderByDesc($sortField);

		$query = DataTableService::buildFilters($query, $filters);

		return $query->paginate($rows, ['*'], 'page', $page + 1);
	}


}