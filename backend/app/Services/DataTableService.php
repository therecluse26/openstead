<?php

namespace App\Services;

use App\Contracts\Repository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Service for general Datatable functionality
 */
class DataTableService
{

	public static function buildOrderBy(Model|Repository|Builder $model, string $sortField, int $sortOrder)
	{
		return $sortOrder === 1 ? $model->orderBy($sortField) : $model->orderByDesc($sortField);
	}

	/**
	 * Builds filters for datatable
	 *
	 * @param Builder $query
	 * @param object $filters
	 * @return Builder
	 */
	public static function buildFilters(Builder|Model|Repository $query, object $filters)
	{
		foreach ($filters as $key => $filter) {
			if (empty($filter->value)) {
				continue;
			}
			$formattedFilter = self::getFilter($filter);

			if (str_contains($key, '.')) {
				[$relation, $key] = explode('.', $key);
				$query->whereRelation($relation, $key, $formattedFilter['method'], $formattedFilter['value']);
			} else {
				$query->where($key, $formattedFilter['method'], $formattedFilter['value']);
			}
		}

		return $query;

	}

	/**
	 * Gets appropriate operator for datatable filter match mode
	 *
	 * @param $filter
	 * @return array|string[]
	 */
	public static function getFilter($filter)
	{
		return match ($filter->matchMode ?? null) {
			'equals' => ['method' => '=', 'value' => $filter->value],
			'notEquals' => ['method' => '<>', 'value' => $filter->value],
			'gt' => ['method' => '>', 'value' => $filter->value],
			'lt' => ['method' => '<', 'value' => $filter->value],
			'gte' => ['method' => '>=', 'value' => $filter->value],
			'lte' => ['method' => '<=', 'value' => $filter->value],
			'contains' => ['method' => 'like', 'value' => "%$filter->value%"],
			'notContains' => ['method' => 'not like', 'value' => "%$filter->value%"],
			'startsWith' => ['method' => 'like', 'value' => "$filter->value%"],
			'endsWith' => ['method' => 'like', 'value' => "%$filter->value"],
			null => ['method' => '=', 'value' => $filter->value]
		};
	}
}