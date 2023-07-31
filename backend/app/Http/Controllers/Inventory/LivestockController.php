<?php

namespace App\Http\Controllers\Inventory;

use App\Contracts\HasAppendableSelect;
use App\Enums\AnimalType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreLivestockBreedRequest;
use App\Http\Requests\Inventory\StoreLivestockRequest;
use App\Http\Requests\Inventory\UpdateLivestockRequest;
use App\Models\Inventory\Livestock;
use App\Repositories\Inventory\LivestockRepository;
use App\Resources\Inventory\List\LivestockResource;
use App\Resources\Inventory\List\PaginatedInventoryResource;
use App\Resources\LivestockDropdownResource;
use App\Resources\VarietyDropdownResource;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use JsonException;

final class LivestockController extends Controller implements HasAppendableSelect
{
	public function getTypes(): iterable
	{
		return (new LivestockRepository)->getFilters()['types'];
	}

	public function getTypeValues(string $type): ResourceCollection
	{
		return VarietyDropdownResource::collection(
			LivestockRepository::getTypeVarieties($type)
		);
	}

	public function getFilters(LivestockRepository $respository): iterable
	{
		return $respository->getFilters();
	}

	public function storeTypeValue(LivestockRepository $repository, StoreLivestockBreedRequest $request): Response
	{
		return response($repository->createVarietyValue($request), 200);
	}

	public function getTypeMembers(LivestockRepository $livestockRepository, AnimalType $type): ResourceCollection
	{
		return LivestockDropdownResource::collection(
			$livestockRepository->getTypeMembers($type)
		);
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
				$inventoryService::buildInventoryTableData(Livestock::class, $request),
				LivestockResource::class
			)
		);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreLivestockRequest $request
	 * @return Response
	 */
	public function store(StoreLivestockRequest $request, LivestockRepository $livestockRepository)
	{
		return response(
			$livestockRepository->create(
				$request->only((new Livestock())->getFillable()),
				$request->get('images'),
				$request->get('parents'),
				$request->get('children')),
			200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param LivestockRepository $livestockRepository
	 * @param string $livestock_id
	 * @return Response
	 */
	public function show(LivestockRepository $livestockRepository, string $livestock_id): Response
	{
		return response(
			$livestockRepository->findUnscoped($livestock_id)->getDetailResource()
		);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param LivestockRepository $livestockRepository
	 * @param UpdateLivestockRequest $request
	 * @param string $livestock
	 * @return Response
	 */
	public function update(LivestockRepository $livestockRepository, UpdateLivestockRequest $request, string $livestock): Response
	{
		return response(
			$livestockRepository->update(
				$livestockRepository->findUnscoped($livestock),
				$request->only((new Livestock())->getFillable()),
				$request->get('images'),
				$request->get('parents'),
				$request->get('children')),
			200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param string $livestock
	 * @param LivestockRepository $livestockRepository
	 * @return Response
	 */
	public function destroy(string $livestock, LivestockRepository $livestockRepository): Response
	{
		return response(
			$livestockRepository->delete(
				$livestockRepository->findUnscoped($livestock)
			),
			200);
	}

	/**
	 * Remove the specified resources from storage by array of IDs
	 *
	 * @param array $ids
	 * @param LivestockRepository $livestockRepository
	 * @return Response
	 */
	public function destroyMultiple(array $ids, LivestockRepository $livestockRepository): Response
	{
		return response(
			$livestockRepository->deleteMultiple($ids),
			200);
	}

	/**
	 * Marks livestock as deceased
	 *
	 * @param string $livestock
	 * @param LivestockRepository $livestockRepository
	 * @return Response
	 */
	public function markDeceased(string $livestock, LivestockRepository $livestockRepository): Response
	{
		return response(
			$livestockRepository->markDeceased(
				$livestockRepository->findUnscoped($livestock),
				true),
			200);
	}

	/**
	 * Gets similar livestock by type
	 *
	 * @param string $livestock
	 * @return Response
	 */
	public function getSimilar(LivestockRepository $livestockRepository, string $livestock)
	{
		return response(LivestockResource::collection(
			$livestockRepository->getSimilar(
				$livestock
			)
		));
	}
}
