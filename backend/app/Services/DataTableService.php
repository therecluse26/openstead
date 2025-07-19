<?php

namespace App\Services;

use App\Contracts\Repository;
use Illuminate\Contracts\Database\Query\Builder as QueryBuilder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use JsonException;
use ReflectionClass;
use ReflectionException;


/**
 * Service for general Datatable functionality
 */
class DataTableService
{

	/**
	 * @throws ReflectionException
	 * @throws JsonException
	 */
	public static function buildAndExecuteQuery(Builder|Model|Repository $model, object $params): LengthAwarePaginator
	{
		$rows = $params->rows ?? 15;
		$page = $params->page ?? 0;

		$sortOrder = $params->sortOrder ?? 1;
		$sortField = self::getFieldName($params->sortField);

		$query = self::buildOrderBy($model, $sortField, $sortOrder);

		$filters = (array)$params->filters;
		foreach ($filters as $filterName => $filterValue) {
			unset($filters[$filterName]);
			$filterName = $filterValue->filterFieldName ?? $filterName;
			$filters[$filterName] = $filterValue;
		}

		$query = self::buildFilters($query, (object)$filters);
	
		/**
		 * Expects an array of functions that will be called with the query and params
		 * 
		 * Note: the function must pass the query by reference in order to modify the outer query
		 * 
		 * Example:
		 * $params->joins = [
		 * 	'tenant_users' => function(&$query, $params) {
		 * 		$query->join('tenant_users', 'users.id', '=', 'tenant_users.user_id')
		 * 		->select('tenant_users.id as tenant_user_id', 'users.name', 'users.email', 'users.id')
		 * 		->where('tenant_users.tenant_id', $params->tenantPivotId);
		 * 	}
		 * ];
		 */
		if(isset($params->joins) && count($params->joins) > 0 ){
			foreach($params->joins as $joinFunction){
				$joinFunction($query, $params);
			}
		}
		
		if(isset($params->tenantId)){
			$filters['tenant_id'] = (object)[
				'value' => $params->tenantId,
				'matchMode' => 'equals'
			];
		}

		return $query->paginate($rows, ['*'], 'page', $page + 1);
	}


	/**
	 * @throws ReflectionException
	 */
	public static function buildOrderBy(Model|Repository|Builder|QueryBuilder $modelQuery, array $sortField, int $sortOrder)
	{
		$modelInstance = $modelQuery instanceof Repository || $modelQuery instanceof Builder ? $modelQuery->getModel() : $modelQuery;

		$field = $sortField['field'] ?? 'id';
		$relation = $sortField['relation'];

		if ($relation && self::isRelation($modelInstance, $relation)) {
			$relationRecord = self::getModelField($modelInstance, $relation);
			$relatedSortField = $relationRecord->getTable() . "." . $field;
			$localKey = strtolower((new ReflectionClass($relationRecord))->getShortName()) . "_id";
			$modelQuery = $modelQuery->join($relationRecord->getTable(), $relationRecord->getTable() . '.' . $relationRecord->getKeyName(), '=', $localKey);
			$sortOrder === 1 ? $modelQuery->orderBy($relatedSortField) : $modelQuery->orderByDesc($relatedSortField);
			return $modelQuery;
		}

		return $sortOrder === 1 ? $modelQuery->orderBy($field) : $modelQuery->orderByDesc($field);
	}

	/**
	 * Builds filters for datatable
	 *
	 * @param Builder|Model|Repository|QueryBuilder $query
	 * @param object $filters
	 * @return Model|Repository|Builder|QueryBuilder
	 */
	public static function buildFilters(Builder|Model|Repository|QueryBuilder $query, object $filters)
	{
		foreach ($filters as $key => $filter) {

			if($key === 'pivotFilters')
			{
				foreach ($filter as $pivotFilterName => $pivotFilterValue) {
					$query->wherePivot($pivotFilterName, $pivotFilterValue->value);
				}
			}

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
	 * @throws ReflectionException
	 */
	public static function isRelation(Model $model, string $relation): bool
	{
		if (in_array($relation, get_class_methods($model::class))) {
			$returnType = (new ReflectionClass($model))->getMethod($relation)->getReturnType()?->getName();
			return (new ReflectionClass($returnType))->isSubclassOf(Relation::class);
		}
		return false;
	}

	public static function getModelField($model, $field)
	{
		return ($model)->$field()->getModel();
	}

	public static function getFieldName(?string $fieldName): array
	{
		if (!$fieldName) {
			return ['relation' => null, 'field' => null];
		}

		// Checks for relation via dot notation. Currently only handles 1 relation deep.
		$fieldParts = explode('.', $fieldName);
		return count($fieldParts) > 1 ? ['relation' => $fieldParts[0], 'field' => $fieldName] : ['relation' => null, 'field' => $fieldName];
	}

	/**
	 * Gets appropriate operator for datatable filter match mode
	 *
	 * @param $filter
	 * @return array|string[]
	 */
	public static function getFilter($filter): array
	{
		return match ($filter->matchMode ?? null) {
			'equals', null => ['method' => '=', 'value' => $filter->value],
			'notEquals' => ['method' => '<>', 'value' => $filter->value],
			'gt' => ['method' => '>', 'value' => $filter->value],
			'lt' => ['method' => '<', 'value' => $filter->value],
			'gte' => ['method' => '>=', 'value' => $filter->value],
			'lte' => ['method' => '<=', 'value' => $filter->value],
			'contains' => ['method' => 'like', 'value' => "%$filter->value%"],
			'notContains' => ['method' => 'not like', 'value' => "%$filter->value%"],
			'startsWith' => ['method' => 'like', 'value' => "$filter->value%"],
			'endsWith' => ['method' => 'like', 'value' => "%$filter->value"]
		};
	}
}