<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;

/**
 * Service for general Datatable functionality
 */
class DataTableService
{
	/**
	 * Builds filters for datatable
	 *
	 * @param Builder $query
	 * @param object $filters
	 * @return Builder
	 */
	public static function buildFilters(Builder $query, object $filters)
	{
		foreach ($filters as $key => $filter) {
			if (empty($filter->value)) {
				continue;
			}
			$formattedFilter = self::getFilter($filter);
			$query->where($key, $formattedFilter['method'], $formattedFilter['value']);
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
		return match ($filter->matchMode) {
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
		};
	}
}