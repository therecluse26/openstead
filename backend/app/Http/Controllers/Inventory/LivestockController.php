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
use Illuminate\Http\JsonResponse;
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

	public function storeTypeValue(LivestockRepository $repository, StoreLivestockBreedRequest $request): JsonResponse
	{
		return response()->json($repository->createVarietyValue($request), 200);
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
	 * @return JsonResponse
	 * @throws JsonException
	 */
	public function index(Request $request, InventoryService $inventoryService): JsonResponse
	{
		return response()->json(
			PaginatedInventoryResource::make(
				$inventoryService::buildInventoryTableData(Livestock::class, $request),
				LivestockResource::class
			), 
		200);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreLivestockRequest $request
	 * @return JsonResponse
	 */
	public function store(StoreLivestockRequest $request, LivestockRepository $livestockRepository): JsonResponse
	{
		return response()->json(
			$livestockRepository->create(
				$request->only((new Livestock())->getFillable()),
				$request->get('images'),
				$request->get('parents'),
				$request->get('children'),
			), 
		201);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param LivestockRepository $livestockRepository
	 * @param string $livestock_id
	 * @return JsonResponse
	 */
	public function show(LivestockRepository $livestockRepository, string $id): JsonResponse
	{
		return response()->json(			
			$livestockRepository->findUnscoped($id)->getDetailResource(),
		200);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param LivestockRepository $livestockRepository
	 * @param UpdateLivestockRequest $request
	 * @param string $livestock
	 * @return JsonResponse
	 */
	public function update(LivestockRepository $livestockRepository, UpdateLivestockRequest $request, string $id): JsonResponse
	{
		return response()->json(
			$livestockRepository->update(
				$livestockRepository->findUnscoped($id),
				$request->only((new Livestock())->getFillable()),
				$request->get('images'),
				$request->get('parents'),
				$request->get('children')
			),
		200);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param string $livestock
	 * @param LivestockRepository $livestockRepository
	 * @return JsonResponse
	 */
	public function destroy(string $id, LivestockRepository $livestockRepository): JsonResponse
	{
		return response()->json(
			$livestockRepository->delete(
				$livestockRepository->findUnscoped($id)
			),
		204);
	}

	/**
	 * Remove the specified resources from storage by array of IDs
	 *
	 * @param array $ids
	 * @param LivestockRepository $livestockRepository
	 * @return JsonResponse
	 */
	public function destroyMultiple(array $ids, LivestockRepository $livestockRepository): JsonResponse
	{
		return response()->json($livestockRepository->deleteMultiple($ids), 200);
	}

	/**
	 * Marks livestock as deceased
	 *
	 * @param string $livestock
	 * @param LivestockRepository $livestockRepository
	 * @return JsonResponse
	 */
	public function markDeceased(string $id, LivestockRepository $livestockRepository): JsonResponse
	{
		return response()->json(
			$livestockRepository->markDeceased(
				$livestockRepository->findUnscoped($id),
				true
			),
		200);
	}

	/**
	 * Gets similar livestock by type
	 *
	 * @param string $livestock
	 * @return JsonResponse
	 */
	public function getSimilar(LivestockRepository $livestockRepository, string $id): JsonResponse
	{
		return response()->json(LivestockResource::collection(
			$livestockRepository->getSimilar(
				$id
			)
		), 200);
	}
}
