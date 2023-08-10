<?php
use App\Http\Controllers\Inventory\SeedController;
use App\Services\RouteBuilderService;
use Illuminate\Support\Facades\Route;

RouteBuilderService::buildTypeFilterRoute(SeedController::class);
Route::get('/filters', [SeedController::class, 'getFilters']);
Route::get('/life-cycles', [SeedController::class, 'getLifeCycles']);
Route::get('/light-requirements', [SeedController::class, 'getLightRequirements']);
Route::get('/hardiness-zones', [SeedController::class, 'getHardinessZones']);
Route::get('/{id}/similar', [SeedController::class, 'getSimilar']);

Route::prefix('')->name('seeds.')->group(static function () {
    Route::get('/', [SeedController::class, 'index']);
    Route::post('/', [SeedController::class, 'store']);
    Route::put('/{id}', [SeedController::class, 'update']);
    Route::get('/{id}', [SeedController::class, 'show']);
    Route::delete('/{id}', [SeedController::class, 'destroy']);
});