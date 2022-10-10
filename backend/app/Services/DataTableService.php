<?php

namespace App\Services;

use App\Contracts\Inventoriable;
use App\Contracts\Repository;
use App\Repositories\Inventory\InventoryRepository;
use Illuminate\Contracts\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use ReflectionClass;
use ReflectionException;


/**
 * Service for general Datatable functionality
 */
class DataTableService
{

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
		return ($model::factory()->make())->getAttribute($field);
	}

	public static function getSortField(?string $fieldName): array
	{
		if (!$fieldName) {
			return ['relation' => null, 'field' => null];
		}
		$fieldParts = explode('.', $fieldName);
		return count($fieldParts) > 1 ? ['relation' => $fieldParts[0], 'field' => $fieldParts[1]] : ['relation' => null, 'field' => $fieldName];
	}

	public static function getFieldInModelOrRelation(Builder|Inventoriable|InventoryRepository $model, string $fieldName): string
	{
		$columns = $model->getConnection()->getSchemaBuilder()->getColumnListing($model->getTable());
		if (!in_array($fieldName, $columns, true)) {
			return $fieldName;
		}
		return $fieldName;
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