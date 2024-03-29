<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\CreateProjectItemRequest;
use App\Http\Requests\Projects\ListProjectRequest;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectItemsRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectItem;
use App\Repositories\Project\ProjectRepository;
use App\Resources\Projects\Detail\ProjectItemStatusResource;
use App\Resources\Projects\List\PaginatedProjectResource;
use App\Resources\Projects\List\ProjectListResource;
use App\Services\Projects\ProjectService;
use Illuminate\Http\JsonResponse;
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
     * @param string $id
     * @return Response
     */
    public function show(ProjectRepository $repository, string $id): Response
	{
		return response(
			$repository->getById($id)->getDetailResource()
		);
	}

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreProjectRequest $request
     * @param ProjectRepository $repository
     * @return Response
     */
	public function store(StoreProjectRequest $request, ProjectRepository $repository): JsonResponse
	{
		return response()->json(
			$repository->create(
                $request->only((new Project())->getFillable()),
                $request->input('users')
            ), 
        200);
	}

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateProjectRequest $request
     * @param string $project
     * @param ProjectRepository $repository
     * @return Response
     */
	public function update(UpdateProjectRequest $request, string $project, ProjectRepository $repository): Response
	{
		return response(
            $repository->update(
                $project,
                $request->only((new Project())->getFillable()),
                $request->input('users')
            )
        );
	}

    public function createItem(CreateProjectItemRequest $request, string $id, ProjectRepository $repository): Response
    {
        return response(
            $repository->createItem(
                $repository->getById($id),
                $request->only((new ProjectItem())->getfillable())
            ), 
        200);
    }

    public function updateItems(UpdateProjectItemsRequest $request, string $id, ProjectRepository $repository): Response
    {
        return response(
            $repository->updateItems(
                $repository->getById($id),
                $request->only(['items'])
            ), 
        200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $project
     * @param ProjectRepository $repository
     * @return Response
     */
	public function destroy(string $project, ProjectRepository $repository): Response
	{
		return response($repository->delete($project), 200);
	}


    public function getStatuses(string $id, ProjectRepository $repository): Response
    {
        return response(
            ProjectItemStatusResource::collection($repository->getStatuses($id))
        , 200);
    }

    public function getUsers(string $id, ProjectRepository $repository): Response
    {
        return response(
            $repository->getUsers($id)
        , 200);
    }

}
