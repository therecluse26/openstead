<?php
use App\Services\RouteBuilderService;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Inventory\LivestockController;


RouteBuilderService::buildTypeFilterRoute(LivestockController::class);
Route::get('/filters', [LivestockController::class, 'getFilters']);
Route::get('/{livestock}/similar', [LivestockController::class, 'getSimilar']);
Route::post('/{livestock}/deceased', [LivestockController::class, 'markDeceased']);
Route::get('/types/{type}/members', [LivestockController::class, 'getTypeMembers']);

Route::prefix('')->name('livestock.')->group(static function () {
    Route::apiResource('/', LivestockController::class);
    Route::get('/', [LivestockController::class, 'index']);
    Route::post('/', [LivestockController::class, 'store']);
    Route::put('/{id}', [LivestockController::class, 'update']);
    Route::get('/{id}', [LivestockController::class, 'show']);
    Route::delete('/{id}', [LivestockController::class, 'destroy']);
});