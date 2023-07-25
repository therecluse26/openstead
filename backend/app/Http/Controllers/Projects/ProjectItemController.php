<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\ListInventoryRequest;
use App\Http\Requests\Projects\ListProjectRequest;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectItemsRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Projects\Project;
use App\Repositories\Project\ProjectItemRepository;
use App\Repositories\Project\ProjectRepository;
use App\Resources\Projects\List\PaginatedProjectResource;
use App\Resources\Projects\List\ProjectListResource;
use App\Services\Projects\ProjectService;
use Illuminate\Http\Response;
use JsonException;
use ReflectionException;

final class ProjectItemController extends Controller
{
	
    
    /**
     * Display the specified resource.
     * 
     * @param ProjectItemRepository $epository
     * @param int $project
     * @return Response
     */
    public function show(ProjectItemRepository $repository, string $project, string $item): Response
	{
		return response(
			$repository->getById($item)->getDetailResource()
		);
	}

}
