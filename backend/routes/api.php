<?php

use App\Http\Controllers\Generic\NoteController;
use App\Http\Controllers\Inventory\EquipmentController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\LivestockController;
use App\Http\Controllers\Inventory\SeedController;
use App\Http\Controllers\Inventory\ServiceLogController;
use App\Http\Controllers\ServiceController;
use App\Services\RouteBuilderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
	return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {

	Route::prefix('/inventory')
		->group(function () {
			Route::get('/filters', [InventoryController::class, 'getFilters']);
			Route::get('/base/types', [InventoryController::class, 'getTypes']);

			// Equipment
			Route::prefix('/equipment')
				->group(function () {
					Route::get('/types', [EquipmentController::class, 'getTypes']);
					Route::get('/filters', [EquipmentController::class, 'getFilters']);
					Route::get('/{equipment}/similar', [EquipmentController::class, 'getSimilar']);
				});
			Route::apiResource('/equipment', EquipmentController::class);

			// Livestock
			Route::prefix('/livestock')
				->group(function () {
					RouteBuilderService::buildTypeFilterRoute(LivestockController::class);
					Route::get('/filters', [LivestockController::class, 'getFilters']);
					Route::get('/{livestock}/similar', [LivestockController::class, 'getSimilar']);
					Route::post('/{livestock}/deceased', [LivestockController::class, 'markDeceased']);
					Route::get('/types/{type}/members', [LivestockController::class, 'getTypeMembers']);
				});
			Route::apiResource('/livestock', LivestockController::class);


			// Seeds
			Route::prefix('/seeds')
				->group(function () {
					RouteBuilderService::buildTypeFilterRoute(SeedController::class);
					Route::get('/filters', [SeedController::class, 'getFilters']);
					Route::get('/life-cycles', [SeedController::class, 'getLifeCycles']);
					Route::get('/light-requirements', [SeedController::class, 'getLightRequirements']);
					Route::get('/hardiness-zones', [SeedController::class, 'getHardinessZones']);
					Route::get('/{id}/similar', [SeedController::class, 'getSimilar']);
				});
			Route::apiResource('/seeds', SeedController::class);


		});

	Route::prefix('/notes')
		->group(function () {
			Route::delete('/{id}', [NoteController::class, 'destroy']);
			Route::get('/{modelName}/{modelId}', [NoteController::class, 'index']);
			Route::post('/', [NoteController::class, 'store']);
		});

	// Services/Service Logs
	Route::prefix('/services')
		->group(function () {
			Route::get('/', [ServiceLogController::class, 'getServices']);
			Route::post('/', [ServiceController::class, 'store']);
			RouteBuilderService::buildTypeFilterRoute(ServiceLogController::class);
			Route::prefix('/logs')
				->group(function () {
					Route::delete('/{id}', [ServiceLogController::class, 'destroy']);
					Route::get('/{modelName}/{modelId}', [ServiceLogController::class, 'index']);
					Route::post('/', [ServiceLogController::class, 'store']);
				});

		});

});



