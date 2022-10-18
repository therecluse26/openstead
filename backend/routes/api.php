<?php

use App\Http\Controllers\Inventory\EquipmentController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\LivestockController;
use App\Http\Controllers\Inventory\SeedController;
use App\Http\Controllers\LocationController;
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

	Route::get('/locations/dropdown', [LocationController::class, 'getLocationsDropdown']);

	Route::prefix('/inventory')
		->group(function () {
			Route::get('/filters', [InventoryController::class, 'getFilters']);

			Route::get('/base/types', [InventoryController::class, 'getTypes']);
			Route::resource('/base', InventoryController::class);

			Route::get('/equipment/types', [EquipmentController::class, 'getTypes']);
			Route::resource('/equipment', EquipmentController::class);

			Route::get('/livestock/types', [LivestockController::class, 'getTypes']);
			Route::resource('/livestock', LivestockController::class);

			Route::get('/seeds/types', [SeedController::class, 'getTypes']);
			Route::resource('/seeds', SeedController::class);
		});
});



