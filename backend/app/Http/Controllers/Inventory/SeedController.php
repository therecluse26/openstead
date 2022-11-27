<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreSeedRequest;
use App\Http\Requests\Inventory\UpdateSeedRequest;
use App\Models\Inventory\Seed;
use App\Repositories\Inventory\SeedRepository;
use App\Resources\Inventory\List\PaginatedInventoryResource;
use App\Resources\Inventory\List\SeedResource;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use JsonException;

final class SeedController extends Controller
{
	public function getTypes(): Collection
	{
		return SeedRepository::getFormattedTypes();
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException
	 */
	public function index(Request $request, InventoryService $inventoryService)
	{
		return response(
			PaginatedInventoryResource::make(
				$inventoryService::buildInventoryTableData(Seed::class, $request),
				SeedResource::class
			)
		);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreSeedRequest $request
	 * @param SeedRepository $repository
	 * @return Response
	 */
	public function store(StoreSeedRequest $request, SeedRepository $repository)
	{
		return response($repository->create($request), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Seed $model
	 * @return Response
	 */
	public function show(Seed $model): Response
	{
		return response($model);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param Seed $model
	 * @return Response
	 */
	public function edit(Seed $model): Response
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateSeedRequest $request
	 * @param Seed $model
	 * @return Response
	 */
	public function update(UpdateSeedRequest $request, Seed $model): Response
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Seed $model
	 * @return Response
	 */
	public function destroy(Seed $model)
	{
		$model->delete();
	}
}
