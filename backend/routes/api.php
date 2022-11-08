<?php

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
			Route::get('/equipment/types', [EquipmentController::class, 'getTypes']);
			Route::get('/equipment/{equipment}/similar', [EquipmentController::class, 'getSimilar']);
			Route::apiResource('/equipment', EquipmentController::class);

			// Livestock
			Route::prefix('/livestock')
				->group(function () {
					RouteBuilderService::buildTypeFilterRoute(LivestockController::class);
					Route::get('/{livestock}/similar', [LivestockController::class, 'getSimilar']);
					Route::get('/types/{type}/members', [LivestockController::class, 'getTypeMembers']);

				});
			Route::apiResource('/livestock', LivestockController::class);

			// Seeds
			Route::get('/seeds/types', [SeedController::class, 'getTypes']);
			Route::apiResource('/seeds', SeedController::class);

		});

	// Services/Service Logs
	Route::prefix('/services')
		->group(function () {
			Route::get('/', [ServiceLogController::class, 'getServices']);
			Route::post('/', [ServiceController::class, 'store']);
			RouteBuilderService::buildTypeFilterRoute(ServiceLogController::class);
			Route::prefix('/logs')
				->group(function () {
					Route::get('/{modelName}/{modelId}', [ServiceLogController::class, 'index']);
					Route::post('/', [ServiceLogController::class, 'store']);
				});

		});

});



