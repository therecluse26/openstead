<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\ListInventoryRequest;
use App\Http\Requests\Projects\ListProjectRequest;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectItemsRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Projects\Project;
use App\Repositories\Project\ProjectRepository;
use App\Resources\Projects\List\PaginatedProjectResource;
use App\Resources\Projects\List\ProjectListResource;
use App\Services\Projects\ProjectService;
use Illuminate\Http\Response;
use JsonException;
use ReflectionException;

final class ProjectController extends Controller
{
	
    /**
     * Display a listing of the resource.
     * 
     * @param ListProjectRequest $request
     * @param ProjectService $service
     * @return Response
     * @throws JsonException
     * @throws ReflectionException
     */
	public function index(ListProjectRequest $request, ProjectService $service): Response
	{
		return response(
			PaginatedProjectResource::make(
				$service::buildPaginatedTableData(Project::class, $request),
				ProjectListResource::class
			)
		);
	}
    
    /**
     * Display the specified resource.
     * 
     * @param ProjectRepository $epository
     * @param int $project
     * @return Response
     */
    public function show(ProjectRepository $repository, string $slug): Response
	{
		return response(
			$repository->getBySlug($slug)->getDetailResource()
		);
	}

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreProjectRequest $request
     * @param ProjectRepository $repository
     * @return Response
     */
	public function store(StoreProjectRequest $request, ProjectRepository $repository): Response
	{
		return response(
			$repository->create($request->only((new Project())->getFillable()),
				$request->get('images')
			), 200);
	}

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateProjectRequest $request
     * @param Project $project
     * @param ProjectRepository $repository
     * @return Response
     */
	public function update(UpdateProjectRequest $request, Project $project, ProjectRepository $repository): Response
	{
		return response($repository->update($project,
			$request->only((new Project())->getFillable()),
			$request->get('images')), 200);
	}

    public function updateItems(UpdateProjectItemsRequest $request, string $slug, ProjectRepository $repository): Response
    {
        return response(
            $repository->updateItems(
                $repository->getBySlug($slug),
                $request->only(['items'])
            ), 
        200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Project $project
     * @param ProjectRepository $repository
     * @return Response
     */
	public function destroy(Project $project, ProjectRepository $repository): Response
	{
		return response($repository->delete($project), 200);
	}

}
