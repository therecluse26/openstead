<?php

namespace App\Http\Controllers\Inventory;

use App\Contracts\HasAppendableSelect;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreSeedRequest;
use App\Http\Requests\Inventory\StoreSeedVarietyRequest;
use App\Http\Requests\Inventory\UpdateSeedRequest;
use App\Models\Inventory\Seed;
use App\Repositories\Inventory\SeedRepository;
use App\Resources\Inventory\List\PaginatedInventoryResource;
use App\Resources\Inventory\List\SeedResource;
use App\Resources\VarietyDropdownResource;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use JsonException;
use ReflectionException;

final class SeedController extends Controller implements HasAppendableSelect
{

	public function getTypes(): Collection
	{
		return SeedRepository::getFormattedTypes();
	}

	public function getTypeValues(string $type): ResourceCollection
	{
		return VarietyDropdownResource::collection(
			SeedRepository::getTypeVarieties($type)
		);
	}

	public function getLifeCycles(): Collection
	{
		return SeedRepository::getLifecycles();
	}

	public function getLightRequirements(): Collection
	{
		return SeedRepository::getLightRequirements();
	}

	public function getHardinessZones(): Collection
	{
		return SeedRepository::getHardinessZones();
	}

	public function getFilters(): Collection
	{
		return SeedRepository::getFilters();
	}

	public function storeTypeValue(SeedRepository $repository, StoreSeedVarietyRequest $request): Response
	{
		return response($repository->createVarietyValue($request), 200);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 * @throws JsonException|ReflectionException
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
	 * Store a newly created resource in storage.
	 *
	 * @param StoreSeedRequest $request
	 * @param SeedRepository $repository
	 * @return Response
	 */
	public function store(StoreSeedRequest $request, SeedRepository $repository)
	{
		return response($repository->create(
			$request->only((new Seed())->getFillable()),
			$request->get('images'),
		), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param SeedRepository $repository
	 * @param int $id
	 * @return Response
	 */
	public function show(SeedRepository $repository, int $id): Response
	{
		return response($repository->find($id)->getDetailResource());
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpdateSeedRequest $request
	 * @param SeedRepository $repository
	 * @return Response
	 */
	public function update(UpdateSeedRequest $request, SeedRepository $repository, int $id): Response
	{
		return response($repository->update(
			$repository->find($id),
			$request->only((new Seed())->getFillable()),
			$request->get('images'),
		), 200);
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

	/**
	 * Gets similar item by type
	 *
	 * @param SeedRepository $repository
	 * @param int $id
	 * @return Response
	 */
	public function getSimilar(SeedRepository $repository, int $id)
	{
		return response(SeedResource::collection(
			$repository->getSimilar(
				$id
			)
		));
	}
}
