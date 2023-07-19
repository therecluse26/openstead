<?php
namespace App\Services\Projects;

use App\Contracts\DataTablePaginatable;
use App\Repositories\Project\ProjectRepository;
use App\Services\DataTableService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use InvalidArgumentException;


class ProjectService {
    /**
	 * Builds data for inventory Datatable
	 *
	 * @throws JsonException
	 * @throws ReflectionException
	 */
	public static function buildPaginatedTableData(string $model, Request $request): LengthAwarePaginator
	{
		if (!isset(class_implements($model)[DataTablePaginatable::class])) {
			throw new InvalidArgumentException('Given model must implement ' . DataTablePaginatable::class);
		}

		return DataTableService::buildAndExecuteQuery(
			new ProjectRepository(new $model()),
			json_decode($request->get('lazyEvent'), false, 512, JSON_THROW_ON_ERROR)
		);
	}
}