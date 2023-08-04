<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Repositories\Project\ProjectItemRepository;
use Illuminate\Http\Response;

final class ProjectItemController extends Controller
{
    /**
     * Display the specified resource.
     * 
     * @param ProjectItemRepository $epository
     * @param string $project_id
     * @param string $item_id
     * @return Response
     */
    public function show(ProjectItemRepository $repository, string $project_id, string $item_id): Response
	{
		return response(
			$repository->getById($item_id)->getDetailResource()
		);
	}

}
